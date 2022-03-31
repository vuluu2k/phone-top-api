import authRouter from './auth';
import categoryRouter from './category';
import productRouter from './product';
import commentRouter from './comment';

function route(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/product', productRouter);
  app.use('/api/comment', commentRouter);
}

export default route;
