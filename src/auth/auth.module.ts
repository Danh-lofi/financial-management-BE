import * as dotenv from 'dotenv';
import { RequestContextModule } from 'nestjs-request-context';
import { ContextInterceptor } from '@/interceptor/request-context.interceptor';
import { Module, forwardRef } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UserModule } from '../users/user.module';
import { UsersService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JsonWebTokenStrategy } from './strategies/jwt.strategy';

dotenv.config();

@Module({
  imports: [
    RequestContextModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JsonWebTokenStrategy,
    UsersService,
    { provide: APP_INTERCEPTOR, useClass: ContextInterceptor },
  ],
  exports: [AuthService],
})
export class AuthModule {}
