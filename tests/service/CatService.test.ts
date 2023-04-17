import { CreateCatRequestDto } from '../../src/controllers/dtos/CatRequest.dto';
import catService from '../../src/services/Cat.service';
import catRepository from '../../src/repositories/Cat.repository';
import catMapper from '../../src/mappers/Cat.mapper';
import { CatEntity } from '../../src/repositories/entities/Cat.entity';
import { Builder } from 'builder-pattern';
import { CatType } from '../../src/types/enums/CatType.enum';

describe('Cat Service', () => {
    let createCatRepositoryStub: jest.SpyInstance;
    let getCatRepositoryStub: jest.SpyInstance;

    let catMapperTransformDtoToEntitySpy: jest.SpyInstance;
    let catMapperTransformEntityToDtoSpy: jest.SpyInstance;

    beforeEach(async () => {
        createCatRepositoryStub = jest.spyOn(catRepository, 'create');
        getCatRepositoryStub = jest.spyOn(catRepository, 'get');

        catMapperTransformDtoToEntitySpy = jest.spyOn(catMapper, 'transformDtoToEntity');
        catMapperTransformEntityToDtoSpy = jest.spyOn(catMapper, 'transformEntityToDto');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCat functionality', () => {
        it('should creates a new cat with default type', async () => {
            // Given
            const createCatRequest: CreateCatRequestDto = {
                catId: '60ad4b41972c35af81b0ad69',
                ownerId: 'b63483fd-083b-4723-88ef-9311102ca575',
                apiSecret: '123456',
                startDate: '2019-11-02T08:30:00.000Z',
                endDate: '2019-11-02T08:30:00.000Z'
            };
            createCatRepositoryStub.mockResolvedValue({});
            const expectedCreatedCatEntity: CatEntity = Builder(CatEntity, {
                isActive: false,
                _id: '60ad4b41972c35af81b0ad69',
                ownerId: 'b63483fd-083b-4723-88ef-9311102ca575',
                apiSecret: '123456',
                startDate: '2019-11-02T08:30:00.000Z',
                endDate: '2019-11-02T08:30:00.000Z',
                type: CatType.PRETTY
            }).build();

            // When
            await catService.createCat(createCatRequest);

            // Then
            expect(catMapperTransformDtoToEntitySpy).toHaveBeenCalledTimes(1);

            expect(createCatRepositoryStub).toHaveBeenNthCalledWith(1, expectedCreatedCatEntity);

            expect(catMapperTransformEntityToDtoSpy).toHaveBeenCalledTimes(1);
        });

        it('should creates a new cat with selected type', async () => {
            // Given
            const createCatRequest: CreateCatRequestDto = {
                catId: '60ad4b41972c35af81b0ad69',
                ownerId: 'b63483fd-083b-4723-88ef-9311102ca575',
                apiSecret: '123456XYZ',
                startDate: '2022-11-02T08:30:00.000Z',
                endDate: '2022-11-02T08:30:00.000Z',
                type: CatType.GRUMPY
            };
            createCatRepositoryStub.mockResolvedValue({});
            const expectedCreatedCatEntity: CatEntity = Builder(CatEntity, {
                isActive: false,
                _id: '60ad4b41972c35af81b0ad69',
                ownerId: 'b63483fd-083b-4723-88ef-9311102ca575',
                apiSecret: '123456XYZ',
                startDate: '2022-11-02T08:30:00.000Z',
                endDate: '2022-11-02T08:30:00.000Z',
                type: CatType.GRUMPY
            }).build();

            // When
            await catService.createCat(createCatRequest);

            // Then
            expect(catMapperTransformDtoToEntitySpy).toHaveBeenCalledTimes(1);

            expect(createCatRepositoryStub).toHaveBeenNthCalledWith(1, expectedCreatedCatEntity);

            expect(catMapperTransformEntityToDtoSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCat functionality', () => {
        it('should return 404 if no Cat is found', async () => {
            // Given
            const catId = '60ad4b41972c35af81b0ad69';
            getCatRepositoryStub.mockResolvedValue({});

            try {
                // When
                await catService.getCat(catId);
            } catch (err: any) {
                // Then
                expect(getCatRepositoryStub).toHaveBeenNthCalledWith(1, catId);
                expect(err.code).toEqual(404);
                expect(err.message).toEqual(`Cat with id ${catId} not found.`);
            }
        });

        it('should successfully return a Cat', async () => {
            // Given
            const catId = '60ad4b41972c35af81b0ad69';
            getCatRepositoryStub.mockResolvedValue({
                isActive: false,
                _id: '60ad4b41972c35af81b0ad69',
                ownerId: 'b63483fd-083b-4723-88ef-9311102ca575',
                apiSecret: '123456',
                startDate: '2019-11-02T08:30:00.000Z',
                endDate: '2019-11-02T08:30:00.000Z',
                type: CatType.PRETTY
            });

            // When
            await catService.getCat(catId);

            // Then
            expect(getCatRepositoryStub).toHaveBeenNthCalledWith(1, catId);

            expect(catMapperTransformEntityToDtoSpy).toHaveBeenCalledTimes(1);
        });
    });
});
