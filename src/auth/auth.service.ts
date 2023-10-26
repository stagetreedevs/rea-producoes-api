/* eslint-disable prettier/prettier */  
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/controllers/admin/shared/admin.service';
@Injectable()
export class AuthService {
  constructor( private adminService: AdminService ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const userAdmin = await this.adminService.findOne(email);

    if (userAdmin && pass === userAdmin.password) {
      const { password, ...result } = userAdmin;
      return result;
    }

    return null;
  }
}