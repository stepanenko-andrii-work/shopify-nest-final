import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as crypto from 'crypto';
import * as cookie from 'cookie';
import {
  IAccessTokenPayload,
  ICheckHmacResult,
  IInstallAppResult,
} from './shopify.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { MongoDBSessionEntity } from '../databases/mongodb/schemas/mongodb-session.schema';
// import { MySQLSessionEntity } from '../databases/mysql/entities/mysql-session.entity';
import { PostgreSQLSessionEntity } from '../databases/postgresql/entities/postgresql-session.entity';
import { PostgreSQLStateEntity } from '../databases/postgresql/entities/postgresql-state.entity';

@Injectable()
export class ShopifyService {
  constructor(
    // @InjectModel(MongoDBSessionEntity.name, 'mongodb') private mongoDBSessionModel: Model<MongoDBSessionEntity>,
    // @InjectRepository(MySQLSessionEntity, 'mysql')
    // private mySQLSessionRepository: Repository<MySQLSessionEntity>,
    @InjectRepository(PostgreSQLSessionEntity, 'postgres')
    private postgreSQLSessionRepository: Repository<PostgreSQLSessionEntity>,
    @InjectRepository(PostgreSQLStateEntity, 'postgres')
    private postgreSQLStateRepository: Repository<PostgreSQLStateEntity>,
  ) {}
  async installApp(request: FastifyRequest): Promise<IInstallAppResult> {
    const query: { shop?: string } = request.query;
    const apiKey = process.env.API_KEY;
    const scopes = process.env.SCOPES.split(',');
    const forwardingAddress = process.env.HOST;

    console.log('ghsg');

    if (query.shop) {
      const state = crypto.randomBytes(16).toString('base64');
      const redirectUri = forwardingAddress + `/api/auth/callback`;

      const stateData: Partial<PostgreSQLStateEntity> = {
        state,
      };

      // const createdSession = await new this.mongoDBSessionModel(sessionData);
      // await createdSession.save();

      // await this.mySQLSessionRepository.save(sessionData);

      await this.postgreSQLStateRepository.delete({ id: MoreThan(0) });
      await this.postgreSQLStateRepository.save(stateData);

      return {
        installUrl:
          `https://${query.shop}/admin/oauth/authorize?client_id=${apiKey}` +
          `&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`,
        state,
      };
    }
    throw new HttpException(
      'Missing "Shop Name" parameter',
      HttpStatus.BAD_REQUEST,
    );
  }
  async checkHmac(request: FastifyRequest): Promise<ICheckHmacResult> {
    const query: {
      shop?: string;
      hmac?: string;
      host?: string;
      code?: string;
      state?: string;
      timestamp?: number;
    } = request.query;
    const { shop, hmac, code, state, host, timestamp } = query;

    console.log(host);

    // console.log(request.headers);
    const stateData = (await this.postgreSQLStateRepository.find())[0].state;

    // const stateCookie = cookie.parse(request.headers.cookie).state;
    // console.log(stateCookie, 'cookie');
    const fixedState = state.replace(/\s/g, '+');

    if (fixedState !== stateData)
      throw new HttpException(
        'Request origin cannot be found',
        HttpStatus.BAD_REQUEST,
      );

    if (!shop || !hmac || !code || !host || !timestamp)
      throw new HttpException(
        'Required parameter missing',
        HttpStatus.BAD_REQUEST,
      );

    const Map = Object.assign({}, request.query);
    delete Map['hmac'];

    const message = `code=${code}&host=${host}&shop=${shop}&state=${state}&timestamp=${timestamp}`;
    const generatedHash = crypto
      .createHmac('sha256', process.env.API_SECRET_KEY)
      .update(message)
      .digest('hex');

    const hashEquals = hmac === generatedHash;

    if (!hashEquals) {
      throw new HttpException('HMAC validation failed', HttpStatus.BAD_REQUEST);
    }

    console.log('2');

    const accessTokenRequestUrl =
      'https://' + shop + '/admin/oauth/access_token';
    const accessTokenPayload = {
      client_id: process.env.API_KEY,
      client_secret: process.env.API_SECRET_KEY,
      code,
    };

    return { accessTokenRequestUrl, accessTokenPayload, shop, host };
  }
  async getAccessToken(
    accessTokenRequestUrl: string,
    accessTokenPayload: IAccessTokenPayload,
    request: FastifyRequest,
  ): Promise<string> {
    try {
      console.log('3');
      const responseData = await fetch(accessTokenRequestUrl, {
        body: JSON.stringify(accessTokenPayload),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const jsonData = await responseData.json();

      console.log('4', jsonData);

      // const sessionData: SessionEntity = {
      // const sessionData: MySQLSessionEntity = {
      const sessionData: PostgreSQLSessionEntity = {
        id: `offline_${process.env.SHOP}`,
        shop: process.env.SHOP,
        state: (await this.postgreSQLStateRepository.find())[0].state,
        isOnline: process.env.IS_ONLINE === 'true' || false,
        scope: process.env.SCOPES,
        accessToken: jsonData.access_token,
      };

      // const createdSession = await new this.mongoDBSessionModel(sessionData);
      // await createdSession.save();

      // await this.mySQLSessionRepository.save(sessionData);

      await this.postgreSQLSessionRepository.save(sessionData);

      return jsonData.access_token;
    } catch (error) {
      throw new HttpException(
        `Couldn't fetch access token, error: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
