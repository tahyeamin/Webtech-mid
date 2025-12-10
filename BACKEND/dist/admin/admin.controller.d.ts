import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getPendingSellers(): Promise<import("../seller/entities/seller.entity").Seller[]>;
    approveSeller(id: string): Promise<{
        message: string;
    }>;
    rejectSeller(id: string, reason?: string): Promise<{
        message: string;
    }>;
}
