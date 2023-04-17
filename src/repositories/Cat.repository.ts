import { CatEntity } from './entities/Cat.entity';
import { getModelForClass } from '@typegoose/typegoose';

export class CatRepository {
    private readonly catModel = getModelForClass(CatEntity);

    public async create(cat: CatEntity): Promise<CatEntity> {
        return (await this.catModel.create(cat)).toObject();
    }

    public async get(catId: string): Promise<CatEntity | null> {
        return this.catModel.findById(catId).lean().exec();
    }

    public async update(updateCat: CatEntity): Promise<CatEntity | null> {
        return this.catModel
            .findByIdAndUpdate(
                updateCat._id,
                {
                    ...updateCat
                },
                {
                    new: true
                }
            )
            .lean()
            .exec();
    }

    public async updateStatus(catId: string, status: boolean): Promise<CatEntity | null> {
        return this.catModel
            .findByIdAndUpdate(
                catId,
                { isActive: status },
                {
                    new: true
                }
            )
            .lean()
            .exec();
    }

    public async delete(catId: string): Promise<CatEntity | null> {
        return this.catModel.findByIdAndDelete(catId).lean().exec();
    }
}

export default new CatRepository();
