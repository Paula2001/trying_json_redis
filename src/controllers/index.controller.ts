import { NextFunction, Request, Response } from 'express';
import { RedisInstance } from '@utils/redis';
import { logger } from '@utils/logger';
import { RediSearchSchema, SchemaFieldTypes } from 'redis';

class IndexController {
  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const TEST_KEY = 'myDoc';

      // RedisJSON uses JSON Path syntax. '.' is the root.

      // await RedisInstance.ft.create(
      //   'idx:users',
      //   {
      //     '$.name': {
      //       type: SchemaFieldTypes.TEXT,
      //       SORTABLE: 'UNF',
      //     },
      //     '$.age': {
      //       type: SchemaFieldTypes.NUMERIC,
      //       AS: 'age',
      //     },
      //     '$.coins': {
      //       type: SchemaFieldTypes.NUMERIC,
      //       AS: 'coins',
      //     },
      //     '$.email': {
      //       type: SchemaFieldTypes.TAG,
      //       AS: 'email',
      //     },
      //   } as unknown as RediSearchSchema,
      //   {
      //     ON: 'JSON',
      //     PREFIX: 'noderedis:users',
      //   },
      // );

      await Promise.all([
        RedisInstance.json.set('noderedis:users:1', '$', {
          name: 'Alice',
          age: 1,
          coins: 100,
          email: 'bob@nonexist.com',
        }),
        RedisInstance.json.set('noderedis:users:2', '$', {
          name: 'Bob',
          age: 23,
          coins: 15,
          email: 'bob@somewhere.gov',
        }),
      ]);
      // const value = await RedisInstance.json.get(TEST_KEY);
      console.log('Users under 30 years old:');
      logger.info(
        // https://redis.io/commands/ft.search/
        JSON.stringify(
          await RedisInstance.ft.search('idx:users', '@age:[0 30]'),
          null,
          2
        )
      );

      logger.info(
        // https://redis.io/commands/ft.search/
        JSON.stringify(
          await RedisInstance.ft.search('idx:users', `@email:{'bob*'}`),
          null,
          2
        )
      );

      // await client.quit();

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
