/* eslint-disable prettier/prettier */  
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/controllers/admin/shared/admin.service';
import { UserService } from 'src/controllers/user/shared/user.service';
@Injectable()
export class AuthService {
  constructor( 
    private adminService: AdminService,
    private userService: UserService ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const userAdmin = await this.adminService.findOne(email);
    const userUser = await this.userService.findOne(email);

    if (userAdmin && pass === userAdmin.password) {
      const { password, ...result } = userAdmin;
      return result;
    }
    else if(userUser && pass === userUser.password) {
      const { password, ...result } = userUser;
      return result;
    }

    return null;
  }
}