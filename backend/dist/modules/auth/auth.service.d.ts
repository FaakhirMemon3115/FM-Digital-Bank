import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
export declare class AuthService {
    private userRepository;
    private walletRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, walletRepository: Repository<Wallet>, jwtService: JwtService);
    register(data: any): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
        };
    }>;
    login(data: any): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
        };
    }>;
}
