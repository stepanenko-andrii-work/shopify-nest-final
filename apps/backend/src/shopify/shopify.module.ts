import { Module } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ShopifyController } from './shopify.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { MongooseModule } from '@nestjs/mongoose';
// import { MongoDBSessionEntity, MongoDBSessionSchema } from '../databases/mongodb/schemas/mongodb-session.schema';
// import { MySQLSessionEntity } from '../databases/mysql/entities/mysql-session.entity';
import { PostgreSQLSessionEntity } from '../databases/postgresql/entities/postgresql-session.entity';
import { PostgreSQLStateEntity } from '../databases/postgresql/entities/postgresql-state.entity';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: MongoDBSessionEntity.name, schema: MongoDBSessionSchema }], 'mongodb'),
    // TypeOrmModule.forFeature([MySQLSessionEntity], 'mysql'),
    TypeOrmModule.forFeature(
      [PostgreSQLSessionEntity, PostgreSQLStateEntity],
      'postgres',
    ),
  ],
  controllers: [ShopifyController],
  providers: [ShopifyService],
})
export class ShopifyModule {}
