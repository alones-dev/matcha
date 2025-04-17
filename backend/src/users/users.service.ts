import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUserByEmailOrUsername(emailOrUsername: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                ],
            },
        });
        return user;
    }

    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user;
    }

    async createUser(data: {
        email: string,
        username: string,
        firstName: string,
        lastName: string,
        gender: string,
        password: string,
        birthDate: Date
    }) {
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                password: data.password,
                birthDate: data.birthDate,
            },
        });
        return user;
    }  
}
