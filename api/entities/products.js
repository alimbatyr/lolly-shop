import path from 'path';
import fs from 'fs';

// IMAGES

const product_images_upload = async (req, res) => {
  const { pg } = req.app.locals;
  const { product_id } = req.body;
  try {
    if (req.files && req.files.length) {
      const promises = req.files.map(
        async ({ filename, mimetype, size, path: filepath, originalname }) => {
          return await pg.query({
            statement: /*sql*/ `
            INSERT INTO images (filename, mimetype, size, filepath, product_id, originalname)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING image_id;
          `,
            params: [
              {
                type: 'text',
                value: filename,
              },
              {
                type: 'text',
                value: mimetype,
              },
              {
                type: 'int4',
                value: size,
              },
              {
                type: 'text',
                value: filepath,
              },
              {
                type: 'int4',
                value: product_id,
              },
              {
                type: 'text',
                value: originalname,
              },
            ],
          });
        }
      );
      await Promise.all(promises);
      return res.json({ message: 'Файлы успешно загружены' });
    }
    return res.json({ message: 'Файлы не загружены' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const product_images_delete = async (req, res) => {
  const { pg } = req.app.locals;
  const { product_id } = req.body;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
          DELETE FROM images WHERE product_id = $1
          RETURNING filepath;
        `,
      params: [
        {
          type: 'int4',
          value: product_id,
        },
      ],
    });
    if (!rows.length) {
      return;
    }
    const filepath_array = rows.map(([filepath]) => filepath);
    await unlink_images(filepath_array);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const images_delete = async (req, res) => {
  const { pg } = req.app.locals;
  const { images } = req.body; // array of image_ids
  if (!images.length) {
    return;
  }
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
          DELETE FROM images WHERE image_id = ANY($1)
          RETURNING filepath;
        `,
      params: [
        {
          type: 'int4[]',
          value: images,
        },
      ],
    });
    const filepath_array = rows.map(([filepath]) => filepath);
    await unlink_images(filepath_array);
    return res.json({ message: 'Файлы успешно удалены' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const product_images_get = async (req, res, product_id) => {
  const { pg } = req.app.locals;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
        SELECT * FROM images
        WHERE product_id = $1
      `,
      params: [{ type: 'int4', value: product_id }],
    });
    const src_prefix = '/api/image';
    const images = rows.map(
      ([image_id, filename, filepath, mimetype, size, product_id, originalname]) => ({
        image_id,
        filename,
        filepath,
        mimetype,
        size: String(size),
        src: `${src_prefix}/${filename}`,
        product_id,
        originalname,
      })
    );
    return images;
  } catch (error) {
    res.status(500).json({ error });
  }
};

const image_get = async (req, res) => {
  const { pg } = req.app.locals;
  const { filename } = req.params;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
        SELECT * FROM images
        WHERE filename = $1
      `,
      params: [{ type: 'text', value: filename }],
    });
    const [, , filepath, mimetype] = rows[0];
    const dirname = path.resolve();
    const full_filepath = path.join(dirname, String(filepath));
    return res.type(mimetype).sendFile(full_filepath);
  } catch (error) {
    res.status(500).json({ error });
  }
};

async function unlink_images(filepath_array) {
  filepath_array.map(filepath => {
    const dirname = path.resolve();
    const full_filepath = path.join(dirname, String(filepath));
    return fs.unlinkSync(full_filepath);
  });
}

// IMAGES

const products_get = async (req, res) => {
  const { pg } = req.app.locals;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `SELECT * FROM products`,
    });
    const promises = rows.map(
      async ([product_id, name, description, price, amount, colors, sizes, userid, created_at]) => {
        const images = await product_images_get(req, res, product_id);
        const categories = await product_categories_get(req, res, product_id);
        return {
          product_id,
          name,
          description,
          price,
          amount,
          categories,
          sizes,
          colors,
          userid,
          images,
          created_at,
        };
      }
    );

    const products = await Promise.all(promises);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// return array of [{ category_id, name }]
const product_categories_get = async (req, res, product_id) => {
  const { pg } = req.app.locals;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
        SELECT category_id FROM product_categories
        WHERE product_id = $1
      `,
      params: [{ type: 'int4', value: product_id }],
    });
    const promises = rows.map(async ([category_id]) => {
      const { rows } = await pg.query({
        statement: /*sql*/ `
            SELECT * FROM categories
            WHERE category_id = $1
          `,
        params: [{ type: 'int4', value: category_id }],
      });
      const [, name] = rows[0];
      return { category_id, name };
    });
    return await Promise.all(promises);
  } catch (error) {
    throw error;
  }
};

const product_upsert = async (req, res) => {
  const { pg } = req.app.locals;

  const { product_id, name, description, price, amount = 0, sizes = [], colors = [] } = req.body;
  const { userid } = req.user;
  const params = [
    {
      type: 'text',
      value: name,
    },
    {
      type: 'text',
      value: description,
    },
    {
      type: 'int4',
      value: price,
    },
    {
      type: 'int4',
      value: amount,
    },
    {
      type: 'text[]',
      value: sizes,
    },
    {
      type: 'text[]',
      value: colors,
    },
  ];
  try {
    // if product_id is not provided, insert new product
    if (!product_id) {
      console.log('insert new product', userid);
      const { scalar } = await pg.query({
        statement: /*sql*/ `
          INSERT INTO products (name, description, price, amount, sizes, colors, userid)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING product_id;
        `,
        params: [
          ...params,
          {
            type: 'text',
            value: userid,
          },
        ],
      });
      return res.json({ product_id: scalar });
    }
    // if product_id is provided, update product
    const { scalar } = await pg.query({
      statement: /*sql*/ `
        UPDATE products
        SET name = $1, description = $2, price = $3, amount = $4, sizes = $5, colors = $6
        WHERE product_id = $7
        RETURNING product_id;
      `,
      params: [
        ...params,
        {
          type: 'int4',
          value: product_id,
        },
      ],
    });
    res.json({ product_id: scalar });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const product_get = async (req, res) => {
  const { pg } = req.app.locals;
  const { product_id } = req.body;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
        SELECT * FROM products
        WHERE product_id = $1
      `,
      params: [
        {
          type: 'int4',
          value: product_id,
        },
      ],
    });
    const [product] = rows.map(
      ([product_id, name, description, price, amount, colors, sizes, userid, created_at]) => ({
        product_id,
        name,
        description,
        price,
        amount,
        sizes,
        colors,
        userid,
        created_at,
      })
    );
    const images = await product_images_get(req, res, product.product_id);
    const categories = await product_categories_get(req, res, product.product_id);
    return res.json({ ...product, images, categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const product_delete = async (req, res) => {
  const { pg } = req.app.locals;
  const { product_id } = req.body;
  try {
    await product_images_delete(req, res);
    const { rows } = await pg.query({
      statement: /*sql*/ `DELETE FROM products WHERE product_id = $1`,
      params: [
        {
          type: 'int4',
          value: product_id,
        },
      ],
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// get all categories
const categories_get = async (req, res) => {
  const { pg } = req.app.locals;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `SELECT * FROM categories`,
    });
    const categories = rows.map(([category_id, name]) => ({ category_id, name }));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// category_upsert
const category_upsert = async (req, res) => {
  const { pg } = req.app.locals;
  const { category_id, name } = req.body;
  try {
    if (!category_id) {
      const { scalar } = await pg.query({
        statement: /*sql*/ `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING category_id;
      `,
        params: [
          {
            type: 'text',
            value: name,
          },
        ],
      });
      return res.json({ category_id: scalar });
    }
    const { scalar } = await pg.query({
      statement: /*sql*/ `
        UPDATE categories
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
      `,
      params: [
        {
          type: 'text',
          value: name,
        },
        {
          type: 'int4',
          value: category_id,
        },
      ],
    });
    res.json({ category_id: scalar });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// category_delete
const category_delete = async (req, res) => {
  const { pg } = req.app.locals;
  const { category_id } = req.body;
  try {
    await pg.query({
      statement: /*sql*/ `DELETE FROM categories WHERE category_id = $1`,
      params: [
        {
          type: 'int4',
          value: category_id,
        },
      ],
    });
    res.json({ category_id, message: 'deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// link product to category
const product_category_link = async (req, res) => {
  const { pg } = req.app.locals;
  const { product_id, categories_ids } = req.body;
  try {
    const promises = categories_ids.map(async category_id => {
      const { rows } = await pg.query({
        statement: /*sql*/ `
          INSERT INTO product_categories (product_id, category_id)
          VALUES ($1, $2)
          RETURNING product_id;
        `,
        params: [
          {
            type: 'int4',
            value: product_id,
          },
          {
            type: 'int4',
            value: category_id,
          },
        ],
      });
      return rows[0][0];
    });
    const product_categories_ids = await Promise.all(promises);
    res.json(product_categories_ids);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// unlink product from category
const product_category_unlink = async (req, res) => {
  const { pg } = req.app.locals;
  const { product_id, categories_ids } = req.body;
  try {
    const promises = categories_ids.map(async category_id => {
      const { rows } = await pg.query({
        statement: /*sql*/ `
          DELETE FROM product_categories
          WHERE product_id = $1 AND category_id = $2
          RETURNING product_id;
        `,
        params: [
          {
            type: 'int4',
            value: product_id,
          },
          {
            type: 'int4',
            value: category_id,
          },
        ],
      });
      return rows[0][0];
    });
    const product_categories_ids = await Promise.all(promises);
    res.json(product_categories_ids);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default {
  products_get,
  product_upsert,
  product_get,
  product_delete,
  product_images_upload,
  image_get,
  images_delete,
  categories_get,
  category_upsert,
  category_delete,
  product_category_link,
  product_category_unlink,
};
