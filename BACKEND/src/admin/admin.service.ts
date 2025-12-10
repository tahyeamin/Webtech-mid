// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller, SellerStatus } from '../seller/entities/seller.entity';
import { MailService } from '../seller/mail/mail.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepo: Repository<Seller>,
    private mailService: MailService,
  ) {}

  async getPendingSellers() {
    return this.sellerRepo.find({
      where: { status: SellerStatus.PENDING },
      select: ['id', 'fullName', 'email', 'phone', 'shopName'],
    });
  }

  async approveSeller(id: string) {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException();

    seller.status = SellerStatus.APPROVED;
    await this.sellerRepo.save(seller);

    await this.mailService.sendApprovalMail(seller.email, seller.fullName, seller.shopName || 'Your Shop');
    return { message: 'Approved & email sent' };
  }

  async rejectSeller(id: string, reason?: string) {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException();

    seller.status = SellerStatus.REJECTED;
    seller.rejectedReason = reason || 'No reason';
    await this.sellerRepo.save(seller);

    await this.mailService.sendRejectionMail(seller.email, seller.fullName, reason || 'No reason');
    return { message: 'Rejected & email sent' };
  }
}