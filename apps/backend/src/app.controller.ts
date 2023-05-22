import { Controller, Get, Redirect, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { IRedirectUrl } from './shopify/shopify.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgreSQLStateEntity } from './databases/postgresql/entities/postgresql-state.entity';
import { Repository } from 'typeorm';
import { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(PostgreSQLStateEntity, 'postgres')
    private postgreSQLStateRepository: Repository<PostgreSQLStateEntity>,
  ) {}

  @Get()
  async redirectToAuth(@Res() reply: FastifyReply) {
    console.log(await this.postgreSQLStateRepository.find());

    if (!(await this.postgreSQLStateRepository.find()).length) {
      console.log('here');
      const installUrl = `/api/auth?shop=test-store-8393683.myshopify.com`;
      reply.redirect(302, installUrl);
    }

    // return reply.send('Hello!');
  }

  @Get('api')
  async default(@Res() reply: FastifyReply) {
    console.log('in default');

    return 'Hello!';
  }
}
