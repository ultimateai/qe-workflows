import { IsMongoId, IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { CatStatusAction } from '../../models/interfaces/Actions.interface';
import { CatType } from '../../types/enums/CatType.enum';
import { AutoMap } from '@automapper/classes';

export class CatRequestDto {
    @AutoMap()
    public catId!: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    public ownerId?: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    public apiSecret?: string;

    @IsDateString()
    @IsOptional()
    @AutoMap()
    public startDate?: string;

    @IsDateString()
    @IsOptional()
    @AutoMap()
    public endDate?: string;

    @IsEnum(CatType)
    @IsOptional()
    @AutoMap()
    public type?: CatType;
}

export class CreateCatRequestDto {
    @IsMongoId()
    public catId!: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    public ownerId?: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    public apiSecret?: string;

    @IsDateString()
    @IsOptional()
    @AutoMap()
    public startDate?: string;

    @IsDateString()
    @IsOptional()
    @AutoMap()
    public endDate?: string;

    @IsEnum(CatType)
    @IsOptional()
    @AutoMap()
    public type?: CatType;
}

export class CatIdDto {
    @IsMongoId()
    public catId!: string;
}

export class UpdateCatRequestDto {
    @IsMongoId()
    public catId!: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    public ownerId?: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    public apiSecret?: string;

    @IsDateString()
    @IsOptional()
    @AutoMap()
    public startDate?: string;

    @IsDateString()
    @IsOptional()
    @AutoMap()
    public endDate?: string;

    @IsEnum(CatType)
    @IsOptional()
    @AutoMap()
    public type?: CatType;
}

export class UpdateCatStatusRequestDto {
    @IsMongoId()
    public catId!: string;

    @IsEnum(CatStatusAction)
    public action!: CatStatusAction;
}

export class DeleteCatRequestDto {
    @IsMongoId()
    public catId!: string;
}
