import authRouter from './auth';
import categoryRouter from './category';
import productRouter from './product';

function route(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/product', productRouter);
}

export default route;
