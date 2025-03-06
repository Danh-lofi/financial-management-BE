import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

dotenv.config();

export interface IAuthPayload {
  id: Types.ObjectId;
  username: string;
  name: string;
  phone: string;
  mail: string;
}

@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: IAuthPayload) {
    return payload;
  }
}
