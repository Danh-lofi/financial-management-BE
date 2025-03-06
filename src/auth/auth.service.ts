import * as dotenv from 'dotenv';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import IUser from '../users/interfaces/user.interface';
import { UsersService } from '../users/user.service';
import { AuthDto } from './dto/auth.dto';
import { LogInDto } from './dto/login.dto';

// import * as admin from 'firebase-admin';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<AuthDto> {
    try {
      const userExist = await this._userService.findOne(createUserDto.username);
      if (userExist) {
        throw new HttpException(
          'User exists. Please use another one!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this._userService.create(createUserDto);

      const accessToken = this.signToken({
        username: user.username,
        name: user.name,
      });

      return {
        accessToken,
        user,
      };
    } catch (err) {
      if (err.response.message.includes('duplicate')) {
        throw new HttpException(
          'User exists. Please use another one!',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Please input valid information',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async loginWithPassword(logInDto: LogInDto): Promise<AuthDto> {
    try {
      const user = await this._userService.findOne(logInDto.username);
      if (!user) {
        throw new HttpException(
          'user does not exist. Please sign up!',
          HttpStatus.NOT_FOUND,
        );
      }
      if (user.password !== logInDto.password) {
        throw new HttpException(
          'Password is incorrect!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { username, name, mail, phone } = user;

      const userPayload: IUser = {
        username,
        name,
        mail,
        phone,
      };

      const accessToken = this.signToken(userPayload);

      return {
        accessToken,
        user,
      };
    } catch (err) {
      throw err;
    }
  }

  //   async loginNotOTP(phone: string): Promise<AuthDto> {
  //     try {
  //       const user = await this._userService.isPhoneExist(phone);

  //       if (!user.data.checked)
  //         throw new HttpException(
  //           'Phone number does not exist. Please sign up!',
  //           HttpStatus.NOT_FOUND,
  //         );

  //       const userPayload = {
  //         id: user.data.data.id,
  //         phone: user.data.data.phone,
  //         email: user.data.data.email,
  //       };

  //       const token = this.signToken(userPayload);

  //       return {
  //         statusCode: HttpStatus.CREATED,
  //         data: {
  //           token,
  //         },
  //       };
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  signToken(userPayload: IUser): string {
    const token = this._jwtService.sign(userPayload, {
      secret: process.env.SECRET_KEY,
      expiresIn: process.env.EXPIRES_IN,
    });
    return token;
  }

  //   async verifyFirebaseToken(idToken: string) {
  //     try {
  //       const decodedToken = await admin.auth().verifyIdToken(idToken);
  //       return decodedToken;
  //     } catch (err) {
  //       throw new HttpException(
  //         'Please authenticate with your phone number!',
  //         HttpStatus.UNAUTHORIZED,
  //       );
  //     }
  //   }
}
