import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Wallet } from '../wallets/entities/wallet.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const { firstName, lastName, email, phone, password } = data;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
    });

    await this.userRepository.save(user);

    // Create wallet for new user
    const wallet = this.walletRepository.create({
      user,
      userId: user.id,
      walletNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      balance: 0,
    });
    await this.walletRepository.save(wallet);

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(data: any) {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid credentials or inactive account');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
