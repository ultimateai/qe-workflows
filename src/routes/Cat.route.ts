import { Router } from 'express';
import catController from '../controllers/Cat.controller';
import {
    CreateCatRequestDto,
    CatIdDto,
    UpdateCatRequestDto,
    DeleteCatRequestDto,
    UpdateCatStatusRequestDto
} from '../controllers/dtos/CatRequest.dto';
import Route from '../models/interfaces/Routes.interface';
import validationMiddleware from '../middlewares/Validation.middleware';
import authMiddleware from '../middlewares/Auth.middleware';

class CatRoute implements Route {
    public path = '/cat';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            authMiddleware,
            validationMiddleware(CreateCatRequestDto),
            catController.create
        );

        this.router.post(
            `${this.path}/update`,
            authMiddleware,
            validationMiddleware(UpdateCatRequestDto),
            catController.update
        );

        this.router.post(
            `${this.path}/update-status`,
            authMiddleware,
            validationMiddleware(UpdateCatStatusRequestDto),
            catController.updateStatus
        );

        this.router.post(`${this.path}/get`, authMiddleware, validationMiddleware(CatIdDto), catController.get);

        this.router.post(
            `${this.path}/delete`,
            authMiddleware,
            validationMiddleware(DeleteCatRequestDto),
            catController.delete
        );
    }
}

export default CatRoute;
