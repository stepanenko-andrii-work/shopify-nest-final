import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { MongoDBSessionEntity } from './databases/mongodb/schemas/mongodb-session.schema';
// import { MySQLSessionEntity } from './databases/mysql/entities/mysql-session.entity';
import { PostgreSQLSessionEntity } from './databases/postgresql/entities/postgresql-session.entity';

import { shopify } from './shopify/shopify.config';
import { Session } from '@shopify/shopify-api';
import { join } from 'path';
import * as fs from 'fs';
import { PostgreSQLStateEntity } from './databases/postgresql/entities/postgresql-state.entity';
@Injectable()
export class AddSessionMiddleware implements NestMiddleware {
  constructor(
    // @InjectModel(MongoDBSessionEntity.name, 'mongodb')
    // private mongoDBSessionModel: Model<MongoDBSessionEntity>,
    // @InjectRepository(MySQLSessionEntity, 'mysql')
    // private mySQLSessionRepository: Repository<MySQLSessionEntity>,
    @InjectRepository(PostgreSQLSessionEntity, 'postgres')
    private postgreSQLSessionRepository: Repository<PostgreSQLSessionEntity>,
  ) {}
  async use(request: FastifyRequest, reply: FastifyReply, next: () => void) {
    // request['sessionData'] = (await this.mongoDBSessionModel.find().exec())[0];
    // request['sessionData'] = (await this.mySQLSessionRepository.find())[0];
    request['sessionData'] = (await this.postgreSQLSessionRepository.find())[0];
    next();
  }
}

@Injectable()
export class EnsureInstalledOnShopMiddleware implements NestMiddleware {
  // @Redirect('/api/auth?shop=test-store-8393683.myshopify.com')
  async use(request: FastifyRequest, reply: FastifyReply, next: () => void) {
    console.log('Checking if app is installed on the shop...');

    try {
      const session: Session = request['sessionData'];
      const res = await shopify.rest.Shop.all({
        session: session,
      });
      if (res.data[0].name === process.env.SHOP)
        console.log(
          `Success, app is installed on the shop "${res.data[0].name}"`,
        );
    } catch (error) {
      console.log(`App is not installed on the shop. Installing...`);
      // return;
      // reply.redirect(302, `/api/auth?shop=test-store-8393683.myshopify.com`);
    }

    next();
  }
}

// export class ValidateAuthenticatedSessionMiddleware implements NestMiddleware {
//   constructor(
//     @InjectRepository(PostgreSQLStateEntity, 'postgres')
//     private postgreSQLStateRepository: Repository<PostgreSQLStateEntity>,
//   ) {}
//   async use(request: FastifyRequest, reply: FastifyReply, next: () => void) {
//     console.log(await this.postgreSQLStateRepository.find());
//
//     if (!(await this.postgreSQLStateRepository.find()).length) {
//       console.log('here');
//       const installUrl = `/api/auth?shop=test-store-8393683.myshopify.com`;
//       reply.redirect(302, installUrl);
//       return;
//     }
//
//     console.log(__dirname);
//
//     const filePath = join(__dirname, '../..', 'frontend', 'dist', 'index.html');
//     const stream = fs.createReadStream(filePath);
//     reply.type('text/html').send(stream);
//
//     next();
//   }
// }
