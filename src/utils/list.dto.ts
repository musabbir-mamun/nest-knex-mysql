import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, Length } from 'class-validator';

export class ListDto {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    offset: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    limit: number;

    @IsOptional()
    @Length(0, 30)
    whereAny: string;

    @IsOptional()
    @IsObject()
    whereLike: object;

    @IsOptional()
    @IsObject()
    where: object;

    @IsOptional()
    @IsArray()
    requiredFields: string[];

    @IsOptional()
    orderBy: string;

    @IsOptional()
    @IsEnum(['asc', 'desc', ''], { message: 'orderAs must be asc or desc' })
    orderAs: string;
}



