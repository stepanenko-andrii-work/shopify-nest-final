import { Controller, Get, Redirect, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { IRedirectUrl } from './shopify/shopify.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgreSQLStateEntity } from './databases/postgresql/entities/postgresql-state.entity';
import { Repository } from 'typeorm';
import { FastifyReply } from 'fastify';
import { join } from 'path';
import * as path from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(PostgreSQLStateEntity, 'postgres')
    private postgreSQLStateRepository: Repository<PostgreSQLStateEntity>,
  ) {}

  @Get('*')
  // @Render('index')
  async redirectToAuth(@Res() reply: FastifyReply) {
    console.log(await this.postgreSQLStateRepository.find());

    if (!(await this.postgreSQLStateRepository.find()).length) {
      console.log('here');
      const installUrl = `/api/auth?shop=test-store-8393683.myshopify.com`;
      reply.redirect(302, installUrl);
      return;
    }

    console.log(__dirname);

    const filePath = path.join(
      __dirname,
      '../..',
      'frontend',
      'dist',
      'index.html',
    );
    const stream = fs.createReadStream(filePath);
    reply.type('text/html').send(stream);
  }
}
