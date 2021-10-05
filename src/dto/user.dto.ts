import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class User {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Length(4, 10, { message: 'Length should be between 4 to 10' })
  password: string;
}
