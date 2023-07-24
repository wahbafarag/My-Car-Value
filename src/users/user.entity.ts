import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Exclude } from 'class-transformer';
import { Report } from '../reports/reports.entity';

@Entity()
export class User {
  save() {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
