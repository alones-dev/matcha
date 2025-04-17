import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(emailOrUsername: string, password: string): Promise<any> {
        const user = await this.usersService.getUserByEmailOrUsername(emailOrUsername);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email, username: user.username };
        const token = this.jwtService.sign(payload);
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
            }
        }
    }

    async register(registerDto: RegisterDto) {
        const {email, username, firstName, lastName, gender, password, confirmPassword, birthDate} = registerDto;

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const existingEmail = await this.usersService.getUserByEmailOrUsername(email);
        if (existingEmail) {
            throw new Error('Email already exists');
        }
        const existingUsername = await this.usersService.getUserByEmailOrUsername(username);
        if (existingUsername) {
            throw new Error('Username already exists');
        }

        if (!['male', 'female'].includes(gender.toLowerCase())) {
            throw new Error('Gender must be either "male" or "female"');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const birthDateObj = new Date(birthDate);
        const today = new Date();
        const adultAge = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        );
        if (isNaN(birthDateObj.getTime())) {
            throw new Error('Invalid birth date');
        }
        if (birthDateObj > adultAge) {
            throw new Error('You must be at least 18 years old');
        }

        const user = await this.usersService.createUser({
            email,
            username,
            firstName,
            lastName,
            gender,
            password: hashedPassword,
            birthDate: birthDateObj,
        });

        const payload = {sub: user.id, email: user.email, username: user.username};
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
            }
        }
    }
}
