import express from 'express';
import pgwire from 'pgwire';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import history from 'connect-history-api-fallback';
import products from './entities/products.js';
import users from './entities/users.js';

const PORT = process.env.PORT || 3000;
const app = express();
app.locals.pg = pgwire.pool(process.env.POSTGRES);

app.use(bodyParser.json());
if (process.env.NODE_ENV === 'production') {
  const static_dist_dir = '/opt/lolly_api/dist';
  app.use(express.static(static_dist_dir));
  app.use(
    history({
      disableDotRule: true,
    })
  );
  app.use(express.static(static_dist_dir));
} else {
  app.use(cors());
}
app.use(bodyParser.urlencoded({ extended: true }));

const image_upload = multer({
  dest: './images',
});

app.get('/', async (req, res) => {
  const { pg } = req.app.locals;

  try {
  const { scalar } = await pg.query({
    statement: /*sql*/ `
      SELECT now()::text;
    `,
  });
  res.json(scalar);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get('/api/image/:filename', products.image_get);
app.post('/api/images_delete', users.authenticate_token, products.images_delete);

app.post('/api/login', users.login);
app.post('/api/user_create', users.authenticate_token, users.user_create);
app.get('/api/verify_token', users.verify_token);

app.get('/api/products', products.products_get);
app.post('/api/products', products.product_upsert);
app.post('/api/product_get', products.product_get);
app.post('/api/product_delete', users.authenticate_token, products.product_delete);
app.post(
  '/api/product_images_upload',
  users.authenticate_token,
  image_upload.array('images'),
  products.product_images_upload
);
app.post('/api/product_upsert', users.authenticate_token, products.product_upsert);
// categories routes
app.get('/api/categories_get', products.categories_get);
app.post('/api/category_upsert', users.authenticate_token, products.category_upsert);
app.post('/api/category_delete', users.authenticate_token, products.category_delete);
app.post('/api/product_category_link', users.authenticate_token, products.product_category_link);
app.post(
  '/api/product_category_unlink',
  users.authenticate_token,
  products.product_category_unlink
);

app.listen(PORT, () => {
  console.log('API listen server: ' + PORT);
});
