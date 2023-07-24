import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    await this.repo.save(user);
    
    return user;
  }

  async findOne(id: number) {
    if (!id) return null;
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, atr: Partial<User>) {
    const user = await this.findOne(id);

    Object.assign(user, atr);
    await this.repo.save(user);
    return user;
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    await this.repo.remove(user);
  }
}
