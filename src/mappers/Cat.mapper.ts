import { CatEntity } from '../repositories/entities/Cat.entity';
import { CatResponseDto } from '../controllers/dtos/CatResponse.dto';

import { CatRequestDto, CreateCatRequestDto, UpdateCatRequestDto } from '../controllers/dtos/CatRequest.dto';
import { createMap, createMapper, forMember, mapFrom } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CatType } from '../types/enums/CatType.enum';

export class CatMapper {
    private readonly mapper = createMapper({
        strategyInitializer: classes()
    });

    constructor() {
        createMap(
            this.mapper,
            CatRequestDto,
            CatEntity,
            // Map user friendly name catId in _id into the entity
            forMember(
                (destination) => destination._id,
                mapFrom((source) => source.catId)
            ),
            forMember(
                (destination) => destination._id,
                mapFrom((source) => source.catId)
            ),
            forMember(
                (destination) => destination.type,
                mapFrom((source) => source.type ?? CatType.PRETTY)
            )
        );
        createMap(
            this.mapper,
            CatEntity,
            CatResponseDto,
            // Map _id to user friendly name catId into the response
            forMember(
                (destination) => destination.catId,
                mapFrom((source) => source._id)
            ),
            // Do not expose sensitive data into the response
            forMember(
                (destination) => destination.isApiSecretFilled,
                mapFrom((source) => Boolean(source.apiSecret))
            )
        );
    }

    public transformEntityToDto(catEntity: CatEntity): CatResponseDto {
        return this.mapper.map(catEntity, CatEntity, CatResponseDto);
    }

    public transformDtoToEntity(catDto: CreateCatRequestDto | UpdateCatRequestDto): CatEntity {
        return this.mapper.map(catDto, CatRequestDto, CatEntity);
    }
}

export default new CatMapper();
