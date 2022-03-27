import express from 'express';
import pgwire from 'pgwire';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import history from 'connect-history-api-fallback';
import products from './entities/products.js';
import users from './entities/users.js';

const PORT = process.env.PORT || 3000;
const app = express();
app.locals.pg = pgwire.pool(process.env.POSTGRES);

app.use(bodyParser.json());
app.use(cors()); // dev only
// app.use(history()); // prod only
app.use(bodyParser.urlencoded({ extended: true }));

const image_upload = multer({
  dest: './images',
});

app.get('/', async (req, res, next) => {
  const { pg } = req.app.locals;
  const { rows } = await pg.query({
    statement: `SELECT * FROM users`,
  });
  res.json(rows);
});

app.get('/api/image/:filename', products.image_get);

app.post('/api/login', users.login);
app.post('/api/user_create', users.authenticate_token, users.user_create);

app.get('/api/products', products.products_get);
app.post('/api/products', products.product_upsert);
app.post('/api/product_get', products.product_get);
app.post('/api/product_delete', users.authenticate_token, products.product_delete);
app.post(
  '/api/product_images_upload',
  image_upload.array('images'),
  products.product_images_upload
);
app.post('/api/product_upsert', users.authenticate_token, products.product_upsert);

app.listen(PORT, () => {
  console.log('API listen server: ' + PORT);
});
