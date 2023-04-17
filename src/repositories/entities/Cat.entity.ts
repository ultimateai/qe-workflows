import { modelOptions, prop } from '@typegoose/typegoose';
import { AutoMap } from '@automapper/classes';
import { CatType } from '../../types/enums/CatType.enum';

// TODO: replace `cats` by the collection name in mongo
@modelOptions({ options: { customName: 'cats' } })
export class CatEntity {
    @AutoMap()
    @prop({ required: true })
    public _id!: string;

    @AutoMap()
    @prop({ default: '' })
    public ownerId: string;

    @AutoMap()
    @prop({ default: '' })
    public apiSecret?: string;

    @AutoMap()
    @prop({ default: false })
    public isActive: boolean = false;

    @AutoMap()
    @prop()
    public startDate?: string;

    @AutoMap()
    @prop()
    public endDate?: string;

    @AutoMap()
    @prop({ enum: CatType, default: CatType.PRETTY })
    public type?: CatType;
}
