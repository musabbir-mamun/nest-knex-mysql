import { Body, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAllUser(@Req() request: Request) {
        return await this.userService.getAllUser();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id' })
    async findUser(@Req() request: Request) {
        return await this.userService.findUser(request.params.id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createUser(@Body() user: User) {
        return await this.userService.createUser(user);
    }

    @Put()
    async updateUser(@Req() request: Request) {
        return await this.userService.updateUser(request.body);
    }

    @Delete()
    async deleteUser(@Req() request: Request) {
        return await this.userService.deleteUser(request.body.id);
    }
}
