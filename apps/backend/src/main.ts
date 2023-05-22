import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HttpException, HttpStatus } from '@nestjs/common';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

(async function bootstrap() {
  const PORT = +process.env.PORT || 3000;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      // exposeHeadRoutes: false,
    }),
  );

  // app.setGlobalPrefix('api');

  await app.register(fastifyStatic, {
    root: join(__dirname, '../..', 'frontend', 'dist'),
    // prefix: '',
  });

  // await app.listen(PORT, 'https://nest-app-3.dev-test.pro');
  try {
    await app.listen(PORT, '0.0.0.0');

    console.log(
      `Authentication link: ${process.env.HOST}/api/auth?shop=${process.env.SHOP}`,
    );
    console.log(
      `Shop link (if already authenticated): https://admin.shopify.com/store/${
        process.env.SHOP.split('.')[0]
      }/apps/${process.env.APP_ADMIN_NAME}`,
    );
  } catch (error) {
    throw new HttpException(
      `Can't connect to the server, ${error}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
})();
