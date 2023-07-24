import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(40)
  @MinLength(4)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  password: string;
}
