import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  Body,
  Query,
  Param,
  HttpStatus,
  HttpCode,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../interceptors/cerialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(
    @Body(ValidationPipe) body: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) body: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }
}
