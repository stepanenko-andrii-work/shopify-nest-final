import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('states')
export class PostgreSQLStateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;
}
