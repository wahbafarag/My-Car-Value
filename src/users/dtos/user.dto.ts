import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose() // SHOW this property to the real world
  email: string;
}
