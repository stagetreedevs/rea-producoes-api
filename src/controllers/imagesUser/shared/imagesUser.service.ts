/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImagesUser } from './imagesUser';
import { KeyService } from 'src/controllers/key/shared/key.service';
@Injectable()
export class ImagesUserService {

    constructor(
        @InjectModel('ImagesUser') private readonly imageModel: Model<ImagesUser>,
        private keyService: KeyService
    ) { }

    async list() {
        return await this.imageModel.find().exec();
    }

    async getById(id: string) {
        return await this.imageModel.findById(id).exec();
    }

    async create(img: any) {
        const created = new this.imageModel(img);
        return await created.save();
    }

    async appCreate(body: any): Promise<any> {
        const { albuns, picture, ledPanel, ...resto } = body;

        const response = {
            ...resto,
            albuns: albuns ? [albuns] : [],
            picture: picture ? [picture] : [],
            ledPanel: ledPanel ? [ledPanel] : [],
        };

        const created = await this.create(response);
        return created;
    }

    async update(id: string, img: ImagesUser) {
        await this.imageModel.updateOne({ _id: id }, img).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.imageModel.deleteOne({ _id: id }).exec();
    }

    //CLASS KEY
    async getClassKey() {
        const keys = await this.imageModel.distinct('class_key').exec();

        const result = await Promise.all(keys.map(async (key) => {
            const className = await this.keyService.getByCodeClass(key);
            return { key, class: className };
        }));

        result.sort((a, b) => a.class.localeCompare(b.class));
        return result;
    }

    async findByClassKey(key: string) {
        const result = await this.imageModel.find({ class_key: key }).sort({ name: 1 }).exec();

        const groupedByEmail = new Map();

        result.forEach(obj => {
            const objJSON = obj.toJSON();  // Convertendo para JSON
            if (groupedByEmail.has(objJSON.email)) {
                const existingObj = groupedByEmail.get(objJSON.email);
                existingObj.albuns = (existingObj.albuns || []).concat(objJSON.albuns || []);
            } else {
                groupedByEmail.set(objJSON.email, { ...objJSON });
            }
        });

        return Array.from(groupedByEmail.values());
    }

    async findByClassKeyWithName(key: string) {
        const results = await this.findByClassKey(key);

        // Mapear os resultados para incluir apenas os campos desejados
        const mappedResults = results.map(obj => ({
            name: obj.name,
            ledPanel: obj.ledPanel,
            picture: obj.picture,
            albuns: obj.albuns
        }));

        return mappedResults;
    }

}