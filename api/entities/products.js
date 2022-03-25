const products_get = async (req, res) => {
  const { pg } = req.app.locals;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `SELECT * FROM products`,
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error });
  }
}

const product_upsert = async (req, res) => {
  const { pg } = req.app.locals;
  const { id, name, price } = req.body;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
        INSERT INTO products (id, name, price)
        VALUES ($1, $2, $3) ON CONFLICT (id)
        DO UPDATE SET name = $2, price = $3
        RETURNING id;
      `,
      values: [id, name, price],
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error });
  }
}

const product_get = async (req, res) => {
  const { pg } = req.app.locals;
  const { id } = req.params;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `SELECT * FROM products WHERE id = $1`,
      parameters: [id],
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error });
  }
}

const product_delete = async (req, res) => {
  const { pg } = req.app.locals;
  const { id } = req.params;
  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `DELETE FROM products WHERE id = $1`,
      parameters: [id],
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error });
  }
}
