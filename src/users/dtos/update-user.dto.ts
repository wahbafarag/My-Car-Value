import {
  IsEmail,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(40)
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(20)
  password?: string;
}
