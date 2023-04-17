import {
    CreateCatRequestDto,
    UpdateCatRequestDto,
    UpdateCatStatusRequestDto
} from '../controllers/dtos/CatRequest.dto';
import { CatResponseDto } from '../controllers/dtos/CatResponse.dto';
import { CatEntity } from '../repositories/entities/Cat.entity';

import { CatCreateError, CatDeleteError, CatNotFoundError, CatUpdateError } from '../errors/Errors';

import { logger } from '../utils/Logger.util';

import { CatStatusAction } from '../models/interfaces/Actions.interface';
import { CatOperations } from '../types/enums/CatOperations.enum';

import catRepositoryInstance, { CatRepository } from '../repositories/Cat.repository';
import catMapperInstance, { CatMapper } from '../mappers/Cat.mapper';

export class CatService {
    constructor(private readonly catRepository: CatRepository, private readonly catMapper: CatMapper) {}

    public async createCat(cat: CreateCatRequestDto): Promise<CatResponseDto> {
        let createdCatEntity: CatEntity | null;
        const catEntity = this.catMapper.transformDtoToEntity(cat);
        try {
            createdCatEntity = await this.catRepository.create(catEntity);
        } catch (err: any) {
            logger.error(`Issues creating cat with id ${cat.catId} due to ${err.message}`, JSON.stringify(err));
            throw new CatCreateError(cat.catId);
        }

        if (!createdCatEntity) {
            logger.error(`Could not create cat with id ${cat.catId}`);
            throw new CatCreateError(cat.catId);
        }

        return this.catMapper.transformEntityToDto(createdCatEntity);
    }

    public async updateCat(cat: UpdateCatRequestDto): Promise<CatResponseDto> {
        let updatedCatEntity: CatEntity | null;
        const catEntityToUpdate = this.catMapper.transformDtoToEntity(cat);
        try {
            updatedCatEntity = await this.catRepository.update(catEntityToUpdate);
        } catch (err: any) {
            logger.error(`Issues updating cat with id ${cat.catId} due to ${err.message}`, JSON.stringify(err));
            throw new CatUpdateError(cat.catId);
        }
        if (!updatedCatEntity) {
            logger.error(`No cat found with id ${cat.catId} during ${CatOperations.UPDATE_CAT} process`);
            throw new CatUpdateError(cat.catId);
        }
        return this.catMapper.transformEntityToDto(updatedCatEntity);
    }

    public async updateCatStatus(updateCatStatusDto: UpdateCatStatusRequestDto): Promise<CatResponseDto> {
        let isActive: boolean;
        if (updateCatStatusDto.action === CatStatusAction.START) {
            isActive = true;
        } else {
            isActive = false;
        }
        return await this.updateCatState(updateCatStatusDto.catId, isActive);
    }

    public async delete(catId: string): Promise<CatResponseDto> {
        let deletedCat: CatEntity | null;
        try {
            deletedCat = await this.catRepository.delete(catId);
        } catch (err: any) {
            logger.error(`Issues deleting cat with id ${catId} due to ${err.message}`, JSON.stringify(err));
            throw new CatDeleteError(catId);
        }

        if (!deletedCat) {
            logger.error(`No cat found with id ${catId} during ${CatOperations.DELETE_CAT} process`);
            throw new CatNotFoundError(catId);
        }
        return this.catMapper.transformEntityToDto(deletedCat);
    }

    public async getCat(catId: string): Promise<CatResponseDto> {
        let catEntity: CatEntity | null;
        try {
            catEntity = await this.catRepository.get(catId);
        } catch (err: any) {
            logger.error(`Issues getting cat with id ${catId} due to ${err.message}`, JSON.stringify(err));
            throw new CatNotFoundError(catId);
        }
        if (!catEntity) {
            logger.error(`No cat found with id ${catId} during ${CatOperations.GET_CAT} process`);
            throw new CatNotFoundError(catId);
        }

        return this.catMapper.transformEntityToDto(catEntity);
    }

    private async updateCatState(catId: string, isActive: boolean): Promise<CatResponseDto> {
        let updatedCat: CatEntity | null;
        try {
            updatedCat = await this.catRepository.updateStatus(catId, isActive);
        } catch (err: any) {
            logger.error(`Issues updating status for cat with id ${catId} due to ${err.message}`, JSON.stringify(err));
            throw new CatUpdateError(catId);
        }
        if (!updatedCat) {
            logger.error(`No cat found with id ${catId} during ${CatOperations.UPDATE_CAT_STATUS} process`);
            throw new CatUpdateError(catId);
        }

        return this.catMapper.transformEntityToDto(updatedCat);
    }
}

export default new CatService(catRepositoryInstance, catMapperInstance);
