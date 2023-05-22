import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ShopifyModule } from './shopify/shopify.module';
import { ProductsModule } from './products/products.module';
import { join } from 'path';
import {
  AddSessionMiddleware,
  // EnsureInstalledOnShopMiddleware,
} from './app.middleware';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySQLSessionEntity } from './databases/mysql/entities/mysql-session.entity';
import { PostgreSQLSessionEntity } from './databases/postgresql/entities/postgresql-session.entity';
import {
  MongoDBSessionEntity,
  MongoDBSessionSchema,
} from './databases/mongodb/schemas/mongodb-session.schema';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PostgreSQLStateEntity } from './databases/postgresql/entities/postgresql-state.entity';

const rootPath =
  process.env.MODE === 'dev'
    ? { rootPath: join(__dirname, '../..', 'frontend') }
    : { rootPath: join(__dirname, '../..', 'frontend', 'dist') };

@Module({
  imports: [
    ShopifyModule,
    ProductsModule,
    // ServeStaticModule.forRoot(rootPath),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // -------------------------------------------
    // MongoDB connection
    MongooseModule.forFeature(
      [{ name: MongoDBSessionEntity.name, schema: MongoDBSessionSchema }],
      'mongodb',
    ),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionName: 'mongodb',
    }),
    // -------------------------------------------
    // MySQL connection
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      useFactory: () => {
        return {
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: +process.env.MYSQL_PORT,
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          entities: [MySQLSessionEntity],
          synchronize: process.env.MODE === 'dev',
        };
      },
    }),
    TypeOrmModule.forFeature([MySQLSessionEntity], 'mysql'),
    // -------------------------------------------
    // PostgreSQL connection
    TypeOrmModule.forRootAsync({
      name: 'postgres',
      useFactory: () => {
        return {
          type: 'postgres',
          host: process.env.POSTGRESQL_HOST,
          port: +process.env.POSTGRESQL_PORT,
          username: process.env.POSTGRESQL_USERNAME,
          password: process.env.POSTGRESQL_PASSWORD,
          database: process.env.POSTGRESQL_DATABASE,
          entities: [PostgreSQLSessionEntity, PostgreSQLStateEntity],
          synchronize: process.env.MODE === 'dev',
        };
      },
    }),
    TypeOrmModule.forFeature(
      [PostgreSQLSessionEntity, PostgreSQLStateEntity],
      'postgres',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AddSessionMiddleware).exclude('/').forRoutes('*');
    // consumer
    //   .apply(EnsureInstalledOnShopMiddleware)
    //   .exclude('/api/auth')
    //   .forRoutes('*');
  }
}
