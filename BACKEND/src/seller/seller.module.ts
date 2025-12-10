// src/seller/seller.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';   // ← এটা লাগবে মেইলারের জন্য

// তোমার Entity গুলো
import { Seller } from './entities/seller.entity';
import { Product } from './entities/product.entity';
import { Wallet } from './entities/wallet.entity';

// তোমার Auth Module
import { SellerAuthModule } from './auth/seller-auth.module';

// তোমার কন্ট্রোলার, সার্ভিস, গার্ড
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { SellerJwtGuard } from './guards/seller-jwt.guard';
import { ActiveSellerGuard } from './guards/active-seller.guard';

// মেইলার
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    // Entity গুলো
    TypeOrmModule.forFeature([Seller, Product, Wallet]),

    // ConfigModule – .env থেকে EMAIL_USER, EMAIL_PASS লোড করার জন্য
    ConfigModule,

    // Auth Module (Register + Login)
    SellerAuthModule,
  ],

  controllers: [SellerController],

  providers: [
    SellerService,
    SellerJwtGuard,
    ActiveSellerGuard,
    MailService,   // ← মেইলার যোগ করা হয়েছে
  ],
})
export class SellerModule {}