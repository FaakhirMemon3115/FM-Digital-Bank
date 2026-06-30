import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletsService } from './wallets.service';

@Controller('api/wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  getMyWallet(@Request() req: any) {
    return this.walletsService.getMyWallet(req.user.id);
  }

  @Get('balance')
  getBalance(@Request() req: any) {
    return this.walletsService.getBalance(req.user.id);
  }

  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  deposit(@Request() req: any, @Body() body: { amount: number; description?: string }) {
    return this.walletsService.deposit(req.user.id, Number(body.amount), body.description);
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  sendMoney(
    @Request() req: any,
    @Body() body: { toWalletNumber: string; amount: number; description?: string },
  ) {
    return this.walletsService.sendMoney(
      req.user.id,
      body.toWalletNumber,
      Number(body.amount),
      body.description,
    );
  }

  @Get('transactions')
  getMyTransactions(@Request() req: any) {
    return this.walletsService.getMyTransactions(req.user.id);
  }
}
