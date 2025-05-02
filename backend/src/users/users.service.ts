import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as sanitizeHtml from 'sanitize-html';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private filesService: FilesService) {}

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
                email: true,
                firstName: true,
                lastName: true,
                username: true,
                avatar: true,
                birthDate: true,
                bio: true,
                photos: true,
                interests: true
            }
        });
        return user;
    }

    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatar: true,
                gender: true,
                birthDate: true,
                bio: true,
                photos: true,
                interests: true,
                latitude: true,
                longitude: true,
                sentLikes: true,
            }
        });
        return users;
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

    async updateUser(id: number, data: {
        email: string,
        username: string,
        firstName: string,
        lastName: string,
        birthDate: string,
        password: string
    }) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {password: true, id: true}
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.id !== id) {
            throw new Error('You are not authorized to update this user');
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password);
        if (!passwordMatch) {
            throw new Error('Incorrect password');
        }

        const birthDateValid = new Date(data.birthDate);
        if (isNaN(birthDateValid.getTime())) {
            throw new Error('Invalid birth date');
        }

        return this.prisma.user.update({
            where: { id },
            data: {
              email: data.email,
              username: data.username,
              firstName: data.firstName,
              lastName: data.lastName,
              ...(data.birthDate && { birthDate: new Date(data.birthDate) }),
            },
        });
    }

    async updateInfos(id: number, data: {
        bio: string,
        interests: string[],
    }) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {id: true}
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.id !== id) {
            throw new Error('You are not authorized to update this user');
        }

        return await this.prisma.user.update({
            where: { id },
            data: {
                bio: data.bio ? sanitizeHtml(data.bio) : undefined,
                interests: {
                    set: [],
                    connectOrCreate: data.interests.map((interestName) => ({
                        where: { name: interestName },
                        create: { name: interestName },
                    })),
                }
            },
        });
    }

    async updateAvatar(id: number, data: {
        avatar: string
    }) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {id: true}
        });
      
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.id !== id) {
            throw new Error('You are not authorized to update this user');
        }
    
        return this.prisma.user.update({
            where: { id },
            data: { avatar: data.avatar }
        });
    }

    async updatePhotos(id: number, data: {
        additions: string[],
        deletions: number[]
    }) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {id: true, photos: true}
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.id !== id) {
            throw new Error('You are not authorized to update this user');
        }

        if (data.deletions && data.deletions.length > 0) {
            const photosToDelete = (user.photos || []).filter(photo => 
                data.deletions.includes(photo.id)
            );
    
            await Promise.all(
                photosToDelete.map(async photo => {
                    await this.filesService.deleteFile(photo.url);
                    await this.prisma.photo.delete({
                        where: { id: photo.id }
                    });
                })
            );
        }
    
        if (data.additions && data.additions.length > 0) {
            await this.prisma.photo.createMany({
                data: data.additions.map(url => ({
                    url,
                    userId: id
                }))
            });
        }
    }

    async likeUser(userId: number, userLiked: number) {
        if (userId === userLiked) {
            throw new Error('You cannot like yourself');
        }

        const [user, userToLike] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
            this.prisma.user.findUnique({ where: { id: userLiked }, select: { id: true } })
        ]);
    
        if (!user || !userToLike || userId !== user.id) {
            throw new NotFoundException('User not found');
        }

        const existingLike = await this.prisma.like.findUnique({
            where: { senderId_receiverId: { senderId: userId, receiverId: userLiked } }
        });
        if (existingLike) {
            throw new Error('You have already liked this user');
        }

        await this.prisma.like.create({
            data: {
                senderId: userId,
                receiverId: userLiked
            }
        });

        const reciprocalLike = await this.prisma.like.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: userLiked,
                    receiverId: userId
                }
            }
        })

        if (reciprocalLike) {
            const isMatch = await this.prisma.match.findFirst({
                where: {
                    OR: [
                        { user1Id: userId, user2Id: userLiked },
                        { user1Id: userLiked, user2Id: userId }
                    ]
                }
            })

            if (!isMatch) {
                await this.prisma.match.create({
                    data: {
                        user1Id: userId,
                        user2Id: userLiked
                    }
                });
            }
        }
    }

    async unLikeUser(userId: number, userUnliked: number) {
        if (userId === userUnliked) {
            throw new Error('You cannot unlike yourself');
        }
    
        const [user, userToUnlike] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
            this.prisma.user.findUnique({ where: { id: userUnliked }, select: { id: true } })
        ]);
    
        if (!user || !userToUnlike || userId !== user.id) {
            throw new NotFoundException('User not found');
        }
    
        const existingLike = await this.prisma.like.findUnique({
            where: { senderId_receiverId: { senderId: userId, receiverId: userUnliked } }
        });
    
        if (!existingLike) {
            throw new Error('You haven’t liked this user');
        }
    
        await this.prisma.like.delete({
            where: { senderId_receiverId: { senderId: userId, receiverId: userUnliked } }
        });
    
        const existingMatch = await this.prisma.match.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: userUnliked },
                    { user1Id: userUnliked, user2Id: userId }
                ]
            }
        });
    
        if (existingMatch) {
            await this.prisma.match.delete({
                where: { id: existingMatch.id }
            });
        }
    }
    
    async getUserMatches(userId: number) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { id: true }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.id !== userId) {
            throw new Error('You are not authorized to view this user\'s matches');
        }

        const matches = await this.prisma.match.findMany({
            where: {
                OR: [
                { user1Id: userId },
                { user2Id: userId },
                ]
            },
            include: {
                user1: true,
                user2: true,
            }
        });
      
        return matches.map(match => {
            const matchedUser = match.user1Id === userId ? match.user2 : match.user1;
            const age = new Date().getFullYear() - matchedUser.birthDate.getFullYear();

            return {
                id: matchedUser.id,
                avatar: matchedUser.avatar || '/default_avatar.png',
                firstName: matchedUser.firstName,
                lastName: matchedUser.lastName,
                username: matchedUser.username,
                age,
            };
        });
    }
}
