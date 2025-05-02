import { Injectable } from '@nestjs/common';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
    constructor() {}

    async saveFile(file: Express.Multer.File): Promise<string> {
        const baseUrl = "http://localhost:4000"
        return `${baseUrl}/uploads/${file.filename}`;
    }

    async deleteFile(url: string): Promise<boolean> {
        try {
            const baseUrl = "http://localhost:4000/uploads/";
            if (!url.startsWith(baseUrl)) return false;
            
            const filename = url.replace(baseUrl, '');
            const path = join(__dirname, '..', '..', 'uploads', filename);
            
            if (existsSync(path)) {
                unlinkSync(path);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

}
