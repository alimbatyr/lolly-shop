import path from 'path';

const product_images_upload = async (req, res) => {
  const { pg } = req.app.locals;
  const { product_id } = req.body;
  try {
    if (req.files && req.files.length) {
      const promises = req.files.map(async ({ filename, mimetype, size, path: filepath, originalname }) => {
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
      });
      await Promise.all(promises);
      return res.json({ message: 'Файлы успешно загружены' });
    }
    return res.json({ message: 'Файлы не загружены' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const product_images_get = async (req, res, product_id) => {
  const { pg } = req.app.locals;
  console.log(product_id)
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
        SELECT * FROM images
        WHERE product_id = $1
      `,
      params: [{ type: 'int4', value: product_id }],
    });
    const src_prefix = '/api/image';
    const images = rows.map(([image_id, filename, filepath, mimetype, size, product_id, originalname]) => ({
      image_id,
      filename,
      filepath,
      mimetype,
      size: String(size),
      src: `${src_prefix}/${filename}`,
      product_id,
      originalname,
    }));
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

const products_get = async (req, res) => {
  const { pg } = req.app.locals;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `SELECT * FROM products`,
    });
    const promises = rows.map(
      async ([
        product_id,
        name,
        description,
        price,
        amount,
        categories,
        sizes,
        colors,
        userid,
      ]) => {
        const images = await product_images_get(req, res, product_id);
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
        };
      }
    );

    return Promise.all(promises).then((products) => res.json(products));
  } catch (error) {
    res.status(500).json({ error });
  }
};

const product_upsert = async (req, res) => {
  const { pg } = req.app.locals;

  const {
    product_id,
    name,
    description,
    price,
    amount = 0,
    sizes = [],
    colors = [],
    categories,
  } = req.body;
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
      ([product_id, name, description, price, amount, categories, sizes, colors, userid]) => ({
        product_id,
        name,
        description,
        price,
        amount,
        categories,
        sizes,
        colors,
        userid,
      })
    );
    const images = await product_images_get(req, res, product.product_id);
    return res.json({ ...product, images });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const product_delete = async (req, res) => {
  const { pg } = req.app.locals;
  const { product_id } = req.body;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `DELETE FROM products WHERE product_id = $1`,
      parameters: [product_id],
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// get categories or insert new category
const check_category_exists = async (req, res) => {
  const { pg } = req.app.locals;
  const { categories } = req.body;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
        SELECT category_id, name FROM categories
        WHERE name IN ($1)
      `,
      params: [{ type: 'text[]', value: categories }],
    });
    return rows;
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
};
