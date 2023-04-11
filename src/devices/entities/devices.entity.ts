import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Devices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  amount: number;
}
