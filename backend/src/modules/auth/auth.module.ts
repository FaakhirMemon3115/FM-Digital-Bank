import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { Wallet } from '../wallets/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-for-mvp',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
