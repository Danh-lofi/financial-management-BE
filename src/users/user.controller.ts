import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { UserDecorator } from './decorators/user.decorator';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly _usersService: UsersService) {}
  @ApiCreatedResponse({
    description: 'Create User succesfully',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this._usersService.create(createUserDto);
  }

  @Get('/get-info')
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  async getInfo(@UserDecorator() user): Promise<User[]> {
    return user;
  }
}
