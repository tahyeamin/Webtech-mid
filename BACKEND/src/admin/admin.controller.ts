// src/admin/admin.controller.ts
import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminJwtGuard } from './guards/admin-jwt.guard';

@Controller('admin')
@UseGuards(AdminJwtGuard)   // শুধু অ্যাডমিন ঢুকবে (পরে ঠিক করবা)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('sellers/pending')
  getPendingSellers() {
    return this.adminService.getPendingSellers();
  }

  @Patch('sellers/:id/approve')
  approveSeller(@Param('id') id: string) {
    return this.adminService.approveSeller(id);
  }

  @Patch('sellers/:id/reject')
  rejectSeller(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.adminService.rejectSeller(id, reason);
  }
}