import IUser from '@/users/interfaces/user.interface';

export class AuthDto {
  accessToken: string;
  user: IUser;
}
