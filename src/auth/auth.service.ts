import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GlobalService } from 'src/utils/global.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(username, pass);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        GlobalService.userId = user.id;
        GlobalService.userTypeId = user.user_type_id;
        const payload = { username: user.username, id: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
