import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './files/files.module';

@Module({
    imports: [AuthModule, UsersModule, PrismaModule, FilesModule],
    controllers: [],
    providers: []
})
export class AppModule {}
