/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation } from './invitation';
import { KeyService } from 'src/controllers/key/shared/key.service';
@Injectable()
export class InvitationService {

    constructor(
        @InjectModel('Invitation') private readonly invitationModel: Model<Invitation>,
        private keyService: KeyService
    ) { }

    async list() {
        return await this.invitationModel.find().exec();
    }

    async getById(id: string) {
        return await this.invitationModel.findById(id).exec();
    }

    async create(convite: Invitation) {
        const existingInvitation = await this.invitationModel.findOne({ email: convite.email }).exec();

        if (existingInvitation) {
            throw new Error('Já existe um convite com esse email.');
        }

        const created = new this.invitationModel(convite);
        return await created.save();
    }


    async update(id: string, convite: Invitation) {
        await this.invitationModel.updateOne({ _id: id }, convite).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.invitationModel.deleteOne({ _id: id }).exec();
    }

    async findByAlbumId(albumId: string): Promise<boolean> {
        const result = await this.invitationModel.exists({ album: albumId });
        return result ? true : false;
    }

    //CLASS KEY
    async getClassKey() {
        const keys = await this.invitationModel.distinct('class_key').exec();

        const result = await Promise.all(keys.map(async (key) => {
            const className = await this.keyService.getByCodeClass(key);
            return { key, class: className };
        }));

        result.sort((a, b) => a.class.localeCompare(b.class));
        return result;
    }

    async findByClassKey(key: string) {
        return await this.invitationModel.find({ class_key: key }).sort({ name: 1 }).exec();
    }

    async findByClassKeyWithName(key: string) {
        return await this.invitationModel.find({ class_key: key })
            .select('name image')
            .sort({ name: 1 })
            .exec();
    }

}