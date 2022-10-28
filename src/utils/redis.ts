import { createClient } from 'redis';
import { logger } from '@utils/logger';

const RedisInstance = createClient({
  socket: {
    host: 'cache', // TODO : add this to config
    port: 6379, // TODO : add this to config
  },
  password: 'password', // TODO : add this to config
});

const initRedis = (): void => {
  RedisInstance.connect()
    .then(() => {
      logger.info('redis is on');
    })
    .catch(err => {
      logger.error('error in redis connection !');
      logger.error(err);
    });
};

export { RedisInstance, initRedis };
