import express from 'express';
import cors from 'cors';

import route from './routers';
import { connect } from './config/db';

const app = express();
const port = process.env.PORT || 5000;

connect();

app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
  })
);

app.use(cors());

app.get('/pay', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '1800');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
});

route(app);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
