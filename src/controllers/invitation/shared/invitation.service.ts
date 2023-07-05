/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation } from './invitation';
@Injectable()
export class InvitationService {

    constructor(
        @InjectModel('Invitation') private readonly invitationModel: Model<Invitation>,
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


}