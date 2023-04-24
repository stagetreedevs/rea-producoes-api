/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Admin } from './shared/admin';
import { AdminService } from './shared/admin.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Administrador')
@Controller('admin')
export class AdminController {

    constructor(
        private adminService: AdminService
    ) {}

    @Get()
    async list() : Promise<Admin[]>{
        return this.adminService.list();
    }

    @Get(':id')
    async getById(@Param('id') id: string) : Promise<Admin>{
        return this.adminService.getById(id);
    }

    @Post()
    async create(@Body() admin: Admin): Promise<Admin>{
        return this.adminService.create(admin)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() admin: Admin): Promise<Admin>{
        return this.adminService.update(id, admin);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        this.adminService.delete(id)
    }
}
