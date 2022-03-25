import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const user_create = async (req, res) => {
  const { pg } = req.app.locals;
  const { userid, password: plain_password } = req.body;

  const password = await bcrypt.hash(plain_password, 10);

  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
        INSERT INTO users (userid, password)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
      values: [userid, password],
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error });
  }
}

const login = async (req, res) => {
  const { pg } = req.app.locals;
  const { userid, password: plain_password } = req.body;

  try {
    const { rows } = await pg.query({
      statement: /*sql*/ `
        SELECT userid, created_at FROM users
        WHERE userid = $1
      `,
      values: [userid],
    });

    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid userid or password' });
      return;
    }

    const [user] = rows;
    const is_valid = await bcrypt.compare(plain_password, user.password);
    if (!is_valid) {
      res.status(401).json({ error: 'Invalid userid or password' });
      return;
    }

    const token = jwt.sign({ userid: user.userid }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error });
  }
}