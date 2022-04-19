import authRouter from './auth';
import categoryRouter from './category';
import productRouter from './product';
import commentRouter from './comment';
import cartRouter from './cart';
import packageRouter from './package';

function route(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/product', productRouter);
  app.use('/api/comment', commentRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/package', packageRouter);
}

export default route;
