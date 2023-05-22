import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MongoDBSessionDocument = HydratedDocument<MongoDBSessionEntity>;

@Schema({ collection: 'sessions' })
export class MongoDBSessionEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  shop: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  isOnline: boolean;

  @Prop({ required: true })
  scope: string;

  @Prop({ required: true })
  accessToken: string;
}

export const MongoDBSessionSchema =
  SchemaFactory.createForClass(MongoDBSessionEntity);
