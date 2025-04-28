import { Controller, Request, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get("getProfile/:id")
    async getProfileMe(@Request() req) {
        const user = await this.usersService.getUserInfos(req.user.id);
        if (!user) {
            return { error: "User not found" };
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            avatar: user.avatar,
            birthDate: user.birthDate,
            bio: user.bio,
        };
    }
}
