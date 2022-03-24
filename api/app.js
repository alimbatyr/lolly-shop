import express from 'express';
import pgwire from 'pgwire';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import history from 'connect-history-api-fallback';

const PORT = process.env.PORT || 3000;
const app = express();
app.locals.pg = pgwire.pool(process.env.POSTGRES);

app.use(bodyParser.json());
app.use(cors()); // dev only
// app.use(history()); // prod only
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  const { pg } = req.app.locals;
  pg.query({
    statement: `SELECT now()::text`,
  })
  .then(({ scalar: greeting }) => {
    res.end(greeting);
  })
  .catch(next);
});

app.listen(PORT, () => {
  console.log('API listen server: ' + PORT);
});


