/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Admin } from './admin';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose';
@Injectable()
export class AdminService {

    constructor (@InjectModel('Admin') private readonly adminModel: Model<Admin>) {}
    
    async list(){
        return await this.adminModel.find().exec();
    }

    async getById(id: string){
        return await this.adminModel.findById(id).exec();
    }

    async findOne(email: string): Promise<Admin | undefined> {
        return this.adminModel.findOne({email: email})   
    }

    async create(admin: Admin){
        const createdAdmin = new this.adminModel(admin);
        return await createdAdmin.save();
    }

    async update(id: string, admin: Admin){
        await this.adminModel.updateOne({ _id: id}, admin).exec()
        return this.getById(id);
    }

    async delete(id: string){
        return await this.adminModel.deleteOne({ _id: id}).exec();
    }
}
