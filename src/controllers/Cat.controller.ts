import { NextFunction, Response, Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CreateCatRequestDto, UpdateCatRequestDto, UpdateCatStatusRequestDto } from './dtos/CatRequest.dto';
import catServiceInstance, { CatService } from '../services/Cat.service';
import { logger } from '../utils/Logger.util';

class CatController {
    constructor(private readonly catService: CatService) {}

    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const createCatRequestDto: CreateCatRequestDto = plainToInstance(CreateCatRequestDto, req.body, {
                exposeUnsetFields: false
            });
            const catResponse = await this.catService.createCat(createCatRequestDto);
            logger.info(`Cat successfully created with id ${catResponse?.catId}`);
            res.status(201).send(catResponse);
        } catch (error: any) {
            next(error);
        }
    };

    public get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { catId } = req.body;
        try {
            const catResponse = await this.catService.getCat(catId);
            res.status(200).send(catResponse);
        } catch (error: any) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const updateCatDto = plainToInstance(UpdateCatRequestDto, req.body, {
                exposeUnsetFields: false
            });
            const updatedCatResponse = await this.catService.updateCat(updateCatDto);
            logger.info(`Cat successfully updated.`);
            res.status(200).send(updatedCatResponse);
        } catch (error: any) {
            next(error);
        }
    };

    public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const updateCatStatusDto: UpdateCatStatusRequestDto = plainToInstance(UpdateCatStatusRequestDto, req.body);
            const updatedStatusResponse = await this.catService.updateCatStatus(updateCatStatusDto);
            res.status(200).send(updatedStatusResponse);
        } catch (error: any) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { catId } = req.body;
        try {
            const deletedResponse = await this.catService.delete(catId);
            logger.info(`Cat successfully deleted.`);
            res.status(200).send(deletedResponse);
        } catch (error: any) {
            next(error);
        }
    };
}

export default new CatController(catServiceInstance);
