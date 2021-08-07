import { Body, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from 'src/dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser(@Req() request: Request) {
    var users = await this.userService.getAllUser();
    return {
      error: false,
      users,
    };
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  async findUser(@Req() request: Request) {
    var user = await this.userService.findUser(request.params.id);
    if (user) {
      return {
        error: false,
        user,
      };
    } else {
      return {
        error: true,
      };
    }
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Body() user: User) {
    var res = await this.userService.createUser(user);

    if (res) {
      return {
        error: false,
        id: res,
      };
    } else {
      return {
        error: true,
      };
    }
  }

  @Put()
  async updateUser(@Req() request: Request) {
    var res = await this.userService.updateUser(request.body);

    if (res) {
      return {
        error: false,
        updated_row: res,
      };
    } else {
      return {
        error: true,
      };
    }
  }

  @Delete()
  async deleteUser(@Req() request: Request) {
    var res = await this.userService.deleteUser(request.body.id);
    if (res) {
      return {
        error: false,
      };
    } else {
      return {
        error: true,
      };
    }
  }
}
