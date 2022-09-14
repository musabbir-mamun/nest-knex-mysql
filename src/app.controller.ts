import { AppService } from './app.service';
import { Controller, Request, Get, Post, UseGuards, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
const Gtts = require('gtts');


@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private authService: AuthService,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('/listen')
    listen(@Request() req, @Response() res) {
        const gtts = new Gtts(req.query.text, req.query.lang);
        gtts.stream().pipe(res);
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}


