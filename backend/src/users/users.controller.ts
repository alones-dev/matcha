import { Controller, Request, Post, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get("getProfile/:id")
    async getProfileMe(@Param('id') id: string) {
        const user = await this.usersService.getUserInfos(parseInt(id));
        if (!user) {
            return { error: "User not found" };
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            avatar: user.avatar,
            birthDate: user.birthDate,
            bio: user.bio,
            photos: user.photos,
            interests: user.interests,
        };
    }

    @Get("getAllUsers")
    async getAllUsers() {
        const users = await this.usersService.getAllUsers();
        if (!users) {
            return { error: "No users found" };
        }

        return users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            avatar: user.avatar,
            birthDate: user.birthDate,
            bio: user.bio,
            photos: user.photos,
            interests: user.interests,
        }));
    }
}
