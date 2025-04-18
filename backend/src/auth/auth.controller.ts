import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
export class AuthController {
    constructor(private authServices: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authServices.login(req.user);
    }

    @Post('register')
    async register(@Request() req) {
        return this.authServices.register(req.body);
    }
}
