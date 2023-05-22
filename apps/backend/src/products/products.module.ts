import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { MongooseModule } from '@nestjs/mongoose';
// import { MongoDBSessionEntity, MongoDBSessionSchema } from '../databases/mongodb/schemas/mongodb-session.schema';
// import { MySQLSessionEntity } from '../databases/mysql/entities/mysql-session.entity';
import { PostgreSQLSessionEntity } from '../databases/postgresql/entities/postgresql-session.entity';
@Module({
  imports: [
    // MongooseModule.forFeature([{ name: MongoDBSessionEntity.name, schema: MongoDBSessionSchema }], 'mongodb'),
    // TypeOrmModule.forFeature([MySQLSessionEntity], 'mysql'),
    TypeOrmModule.forFeature([PostgreSQLSessionEntity], 'postgres'),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
