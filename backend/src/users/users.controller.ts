import { Controller, Request, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // @Post('updateUser')
    // async updateUser(@Request() req) {
    //     return this.usersService.updateUser();
    // }
}
