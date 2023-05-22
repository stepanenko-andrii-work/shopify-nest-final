import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('sessions')
export class MySQLSessionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  shop: string;

  @Column()
  state: string;

  @Column()
  isOnline: boolean;

  @Column()
  scope: string;

  @Column()
  accessToken: string;
}
