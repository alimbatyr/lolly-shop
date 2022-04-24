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

const getActualRequestDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const logger = (req, res, next) => {
  const current_datetime = new Date();
  const formatted_date =
    current_datetime.getFullYear() +
    '-' +
    (current_datetime.getMonth() + 1) +
    '-' +
    current_datetime.getDate() +
    ' ' +
    current_datetime.getHours() +
    ':' +
    current_datetime.getMinutes() +
    ':' +
    current_datetime.getSeconds();
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  const [ip] = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).match(/\d+\.\d+\.\d+\.\d+/);
  const log = `[${formatted_date}] (${ip}) ${method}:${url} ${status} - ${durationInMilliseconds.toLocaleString()} ms`;
  console.log(log);
  next();
};

app.use(logger);

app.use(bodyParser.json());
const static_dist_dir = '/opt/lolly_api/dist';
if (process.env.NODE_ENV === 'production') {
  app.get('/image/:filename', products.image_get);
  app.use(express.static(static_dist_dir));
  app.use(
    history({
      disableDotRule: true,
    })
  );
  app.use(express.static(static_dist_dir));
} else {
  app.use(cors());
  app.get('/api/image/:filename', products.image_get);
}
app.use(bodyParser.urlencoded({ extended: true }));

const image_upload = multer({
  dest: './images',
});

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

const server = app.listen(PORT);

process.on('SIGTERM', on_kill);
process.on('SIGINT', on_kill);

function on_kill() {
  app.locals.pg.clear();
  server.close();
}
