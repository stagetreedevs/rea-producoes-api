/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user';
@Injectable()
export class UserService {

    constructor (
        @InjectModel('User') private readonly userModel: Model<User>,
        ) {}
    
    async list(){
        return await this.userModel.find().exec();
    }

    async findOne(email: string): Promise<User | undefined> {
        return this.userModel.findOne({email: email})   
    }


    async getById(id: string){
        return await this.userModel.findById(id).exec();
    }

    async create(user: User){
        const created = new this.userModel(user);
        return await created.save();
    }

    async update(id: string, user: User){
        await this.userModel.updateOne({ _id: id}, user).exec()
        return this.getById(id);
    }

    async delete(id: string){
        return await this.userModel.deleteOne({ _id: id}).exec();
    }

}