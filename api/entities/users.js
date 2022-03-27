import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const user_create = async (req, res) => {
  const { pg } = req.app.locals;
  const { userid, password: plain_password } = req.body;
  if (!req.user) {
    return res.status(401).json({ error: 'Войдите в систему' });
  }

  const password = await bcrypt.hash(plain_password, 10);

  try {
    const { scalar } = await pg.query({
      statement: /*sql*/ `
        INSERT INTO users (userid, password)
        VALUES ($1, $2)
        RETURNING id;
      `,
      values: [userid, password],
    });
    return res.status(201).json({ id: scalar });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const login = async (req, res) => {
  const { pg } = req.app.locals;
  const { userid, password: plain_password } = req.body;

  try {
    const { rows, empty } = await pg.query({
      statement: /*sql*/ `
        SELECT * FROM users
        WHERE userid = $1
      `,
      params: [{
        type: 'text',
        value: userid,
      }],
    });

    if (empty) {
      res.status(401).json({ error: 'Invalid userid or password' });
      return;
    }

    const [user] = rows;
    const [id, password_hashed] = user;
    const is_valid = await bcrypt.compare(plain_password, password_hashed);
    if (!is_valid) {
      res.status(401).json({ error: 'Invalid userid or password' });
      return;
    }

    const token = jwt.sign({ userid: id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const authenticate_token = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Войдите в систему' });

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return res.status(403).send({ message: 'Ошибка пользователя' });
    req.user = user;
    next();
  });
};

export default {
  user_create,
  login,
  authenticate_token,
};
