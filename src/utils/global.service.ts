import { InternalServerErrorException } from "@nestjs/common";
const fs = require('fs');

export class GlobalService {
    static userId: number;
    static userTypeId: number;

    static async base64ToFile(fileNameLocation: string, base64String: string) {
        await fs.writeFile(fileNameLocation, base64String, 'base64', function (err) {
            if (err) {
                throw new InternalServerErrorException(err.message);
            }
        });
    }
}