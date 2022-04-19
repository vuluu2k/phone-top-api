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

route(app);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
