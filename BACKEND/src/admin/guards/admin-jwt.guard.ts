// src/admin/guards/admin-jwt.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminJwtGuard extends AuthGuard('jwt') {
  // টেস্টিং এর জন্য এখন কোনো চেক করবো না
}