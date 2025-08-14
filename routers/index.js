const authRouter = require('./auth');
const categoryRouter = require('./category');
const productRouter = require('./product');
const commentRouter = require('./comment');
const cartRouter = require('./cart');
const packageRouter = require('./package');
const blogRouter = require('./blog');
const layoutRouter = require('./layout');

function route(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/product', productRouter);
  app.use('/api/comment', commentRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/package', packageRouter);
  app.use('/api/blog', blogRouter);
  app.use('/api/layout', layoutRouter);
}

module.exports = route;
