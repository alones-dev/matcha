import { Controller, Req, UploadedFile, UploadedFiles, Post, Get, Param, Put, Body, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { FilesService } from 'src/files/files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService, private filesService: FilesService) {}

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
            gender: user.gender,
            birthDate: user.birthDate,
            bio: user.bio,
            photos: user.photos,
            interests: user.interests,
            latitude: user.latitude,
            longitude: user.longitude,
            sentLikes: user.sentLikes,
        }));
    }

    @Put("updateProfile/:id")
    async updateProfile(@Param('id') id: string, @Body() body: {
        email: string,
        username: string,
        firstName: string,
        lastName: string,
        birthDate: string,
        password: string
    }) {
        return this.usersService.updateUser(parseInt(id), body);
    }

    @Put("updateInfos/:id")
    async updateInfos(@Param('id') id: string, @Body() body: {
        bio: string,
        interests: string[]
    }) {
        return this.usersService.updateInfos(parseInt(id), body);
    }

    @Put("updateAvatar/:id")
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
            const ext = extname(file.originalname);
            const fileName = `${uuidv4()}${ext}`;
            callback(null, fileName);
            }
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Seules les images sont autorisées'), false);
            }
            callback(null, true);
        }
    }))
    async updateAvatar(
    
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const avatarUrl = await this.filesService.saveFile(file);
    
        return this.usersService.updateAvatar(id, { avatar: avatarUrl });
    }
    
    @Put("updatePhotos/:id")
    @UseInterceptors(FilesInterceptor('photos', 5, {
        storage: diskStorage({
            destination: './uploads',
            filename: (_, file, callback) => {
                const ext = extname(file.originalname);
                const fileName = `${uuidv4()}${ext}`;
                callback(null, fileName);
            }
        }),
        fileFilter: (_, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Seules les images sont autorisées'), false);
            }
            callback(null, true);
        }
    }))
    async updatePhotos(
        @Param('id') id: number,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: { deletions?: string }
    ) {
        let deletions: number[] = [];
    
        try {
            if (body.deletions && body.deletions !== '[]') {
                deletions = JSON.parse(body.deletions);
            }
        } catch (error) {
            console.error('Error parsing deletions', error);
        }

        const photoUrls = await Promise.all(
            (files || []).map(file => this.filesService.saveFile(file))
        );
        
        return this.usersService.updatePhotos(id, {
            additions: photoUrls,
            deletions
        });
    }   

    @Put("like")
    async like(@Body() body: {
        userLiked: number,
        userId: number
    }) {
        return this.usersService.likeUser(body.userId, body.userLiked);
    }

    @Put("unlike")
    async unlike(@Body() body: {
        userLiked: number,
        userId: number
    }) {
        return this.usersService.unLikeUser(body.userId, body.userLiked);
    }

    @Get("matches/:id")
    async getMatches(@Param('id') id: string) {
        const matches = await this.usersService.getUserMatches(parseInt(id));
        if (!matches) {
            return { error: "No matches found" };
        }

        return matches.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            avatar: user.avatar,
            age: user.age,
        }));
    }
}
