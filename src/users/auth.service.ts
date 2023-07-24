import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // check if email is user
    const emailExist = await this.usersService.find(email);
    if (emailExist.length > 0)
      throw new BadRequestException('This email already exist');
    //hash the passwpord
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    //create new user and save the hashed pass
    const user = await this.usersService.create(email, hashedPass);
    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email); // [user] gets just one user
    if (!user) throw new NotFoundException('Invalid Credentials');

    const realPass = bcrypt.compare(password, user.password);
    if (!realPass) throw new BadRequestException('Invalid Credentials');
    return user;
  }
}
