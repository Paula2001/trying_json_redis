import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import { RedisInstance } from '@utils/redis';
import { logger } from '@utils/logger';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute()]);

const server = app.listen();

const serverClosingBreakDown = async () => {
  logger.info('termination signal received');
  await RedisInstance.quit();
  logger.info('redis is closed gracefully');
  server.close(err => {
    if (err) {
      logger.error('Error happened !');
      logger.error(err);
    }
    process.exit(err ? 1 : 0);
  });
};

process.on('SIGTERM', serverClosingBreakDown).on('SIGINT', serverClosingBreakDown).on('uncaughtException', serverClosingBreakDown);
