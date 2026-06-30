"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./entities/wallet.entity");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
const user_entity_1 = require("../users/entities/user.entity");
let WalletsService = class WalletsService {
    walletRepository;
    transactionRepository;
    userRepository;
    constructor(walletRepository, transactionRepository, userRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }
    async getMyWallet(userId) {
        const wallet = await this.walletRepository.findOne({
            where: { userId },
            relations: { user: true },
        });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        return wallet;
    }
    async getBalance(userId) {
        const wallet = await this.walletRepository.findOne({ where: { userId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        return { balance: Number(wallet.balance), currency: wallet.currency, walletNumber: wallet.walletNumber };
    }
    async deposit(userId, amount, description) {
        if (amount <= 0)
            throw new common_1.BadRequestException('Amount must be greater than 0');
        if (amount > 1000000)
            throw new common_1.BadRequestException('Maximum deposit amount is 1,000,000');
        const wallet = await this.walletRepository.findOne({ where: { userId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        if (wallet.status !== 'active')
            throw new common_1.BadRequestException('Wallet is not active');
        const newBalance = Number(wallet.balance) + amount;
        await this.walletRepository.update(wallet.id, { balance: newBalance });
        const refNo = 'DEP-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        const transaction = this.transactionRepository.create({
            referenceNo: refNo,
            receiverWalletId: wallet.id,
            amount,
            fee: 0,
            transactionType: 'deposit',
            status: 'completed',
            description: description || 'Self deposit',
        });
        await this.transactionRepository.save(transaction);
        return {
            message: 'Amount deposited successfully',
            newBalance,
            transaction: {
                referenceNo: refNo,
                amount,
                type: 'deposit',
                status: 'completed',
            },
        };
    }
    async sendMoney(senderUserId, toWalletNumber, amount, description) {
        if (amount <= 0)
            throw new common_1.BadRequestException('Amount must be greater than 0');
        const senderWallet = await this.walletRepository.findOne({ where: { userId: senderUserId } });
        if (!senderWallet)
            throw new common_1.NotFoundException('Your wallet not found');
        if (senderWallet.status !== 'active')
            throw new common_1.BadRequestException('Your wallet is not active');
        if (senderWallet.walletNumber === toWalletNumber) {
            throw new common_1.BadRequestException('Cannot send money to your own wallet');
        }
        if (Number(senderWallet.balance) < amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const receiverWallet = await this.walletRepository.findOne({ where: { walletNumber: toWalletNumber } });
        if (!receiverWallet)
            throw new common_1.NotFoundException('Recipient wallet not found');
        if (receiverWallet.status !== 'active')
            throw new common_1.BadRequestException('Recipient wallet is not active');
        const newSenderBalance = Number(senderWallet.balance) - amount;
        await this.walletRepository.update(senderWallet.id, { balance: newSenderBalance });
        const newReceiverBalance = Number(receiverWallet.balance) + amount;
        await this.walletRepository.update(receiverWallet.id, { balance: newReceiverBalance });
        const refNo = 'TRF-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        const transaction = this.transactionRepository.create({
            referenceNo: refNo,
            senderWalletId: senderWallet.id,
            receiverWalletId: receiverWallet.id,
            amount,
            fee: 0,
            transactionType: 'transfer',
            status: 'completed',
            description: description || 'Money transfer',
        });
        await this.transactionRepository.save(transaction);
        return {
            message: 'Money sent successfully',
            newBalance: newSenderBalance,
            transaction: {
                referenceNo: refNo,
                amount,
                to: toWalletNumber,
                type: 'transfer',
                status: 'completed',
            },
        };
    }
    async getMyTransactions(userId) {
        const wallet = await this.walletRepository.findOne({ where: { userId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        const transactions = await this.transactionRepository.find({
            where: [
                { senderWalletId: wallet.id },
                { receiverWalletId: wallet.id },
            ],
            order: { createdAt: 'DESC' },
            take: 50,
        });
        return transactions.map(tx => ({
            ...tx,
            direction: tx.receiverWalletId === wallet.id ? 'credit' : 'debit',
            amount: Number(tx.amount),
        }));
    }
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map