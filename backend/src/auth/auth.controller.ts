import { Controller, Post, Request, UseGuards, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express'; 
import { RegisterDto } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authServices: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Res({ passthrough: true }) res: Response, @Request() req) {
        const result = await this.authServices.login(req.user);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        return { user: result.user };

    }

    @Post('register')
    async register(
        @Res({ passthrough: true }) res: Response,
        @Body() registerDto: RegisterDto
    ) {
        const result = await this.authServices.register(registerDto);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return { user: result.user };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
          
      return { message: 'Déconnexion réussie' };
    }
}
