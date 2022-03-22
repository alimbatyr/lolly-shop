import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import history from 'connect-history-api-fallback';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors()); // dev only
app.use(history()); // prod only
app.use(bodyParser.urlencoded({ extended: true }));

// send hello world at slash
app.get('/', (req, res) => {
  res.send('hello world');
});


app.listen(PORT, () => {
  console.log('API listen server: ' + PORT);
});