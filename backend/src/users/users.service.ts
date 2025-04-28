import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

    async getUserInfos(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatar: true,
                birthDate: true,
                bio: true,
            }
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
        birthDate: Date,
        latitude: number,
        longitude: number,
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
                latitude: data.latitude,
                longitude: data.longitude,
            },
        });
        return user;
    }

    async updateUser(user: any, id: number, data: {
        email: string,
        username: string,
        firstName: string,
        lastName: string,
        birthDate: string,
        password: string
    }) {
        if (user.id !== id) {
            throw new Error('You are not authorized to update this user');
        }

        const birthDateValid = new Date(data.birthDate);
        if (isNaN(birthDateValid.getTime())) {
            throw new Error('Invalid birth date');
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password);
        if (!passwordMatch) {
            throw new Error('Incorrect password');
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                email: data.email,
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: birthDateValid,
            },
        });
        return updatedUser;
    }

    async updateInfos(user: any, id: number, data: {
        bio: string,
        interests: string[],
    }) {
        if (user.id !== id) {
            throw new Error('You are not authorized to update this user');
        }

        const interests = await Promise.all(
            data.interests.map(async (interestName) => {
                return this.prisma.interest.upsert({
                    where: { name: interestName },
                    update: {},
                    create: { name: interestName },
                });
            })
        );

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                bio: data.bio,
                interests: {
                    set: interests.map(interest => ({ id: interest.id })),
                },
            },
        });
        return updatedUser;
    }
}
