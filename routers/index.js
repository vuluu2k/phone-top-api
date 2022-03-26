import authRouter from './auth';

function route(app) {
  app.use('/api/auth', authRouter);
}

export default route;
