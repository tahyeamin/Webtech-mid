// src/admin/admin.service.ts
// ← এই একটা ফাইলেই সব আছে – কপি-পেস্ট করে রাখো

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
    private mailService: MailService, // ← তোমার Seller পার্টের মেইলার
  ) {}

  // সব PENDING সেলার দেখাবে
  async getPendingSellers() {
    return this.sellerRepo.find({
      where: { status: SellerStatus.PENDING },
      select: ['id', 'fullName', 'email', 'phone', 'shopName', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  // APPROVE করবে + মেইল পাঠাবে
  async approveSeller(id: string) {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException('Seller not found');

    seller.status = SellerStatus.APPROVED;
    await this.sellerRepo.save(seller);

    console.log('Sending approval email to:', seller.email); // টেস্টের জন্য

    try {
      await this.mailService.sendApprovalMail(
        seller.email,
        seller.fullName,
        seller.shopName || 'Your Shop',
      );
      console.log('Approval email sent successfully!');
    } catch (error) {
      console.error('Email failed:', error.message);
    }

    return { message: 'Seller approved & email sent' };
  }

  // REJECT করবে + মেইল পাঠাবে
  async rejectSeller(id: string, reason?: string) {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException('Seller not found');

    seller.status = SellerStatus.REJECTED;
    seller.rejectedReason = reason || 'No reason provided';
    await this.sellerRepo.save(seller);

    console.log('Sending rejection email to:', seller.email); // টেস্টের জন্য

    try {
      await this.mailService.sendRejectionMail(
        seller.email,
        seller.fullName,
        reason || 'No reason provided',
      );
      console.log('Rejection email sent!');
    } catch (error) {
      console.error('Email failed:', error.message);
    }

    return { message: 'Seller rejected & email sent' };
  }
}