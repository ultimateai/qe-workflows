import { IsMongoId } from 'class-validator';
import { CatType } from '../../types/enums/CatType.enum';
import { AutoMap } from '@automapper/classes';

export class CatResponseDto {
    @IsMongoId()
    @AutoMap()
    public catId!: string;

    @AutoMap()
    public ownerId: string;

    @AutoMap()
    public isActive: boolean = false;

    @AutoMap()
    public isApiSecretFilled: boolean;

    @AutoMap()
    public startDate: string;

    @AutoMap()
    public endDate: string;

    @AutoMap()
    public type: CatType;
}
