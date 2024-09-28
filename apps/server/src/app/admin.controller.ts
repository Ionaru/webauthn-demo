import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { AdminService } from './admin.service';

@ApiExcludeController(true)
@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  users() {
    return this.adminService.getUsers();
  }

  @Delete('users/:credentialId')
  deleteUser(@Param('credentialId') credentialId: string) {
    return this.adminService.deleteUser(credentialId);
  }
}
