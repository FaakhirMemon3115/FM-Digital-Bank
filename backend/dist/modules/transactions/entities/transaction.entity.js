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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const typeorm_1 = require("typeorm");
const wallet_entity_1 = require("../../wallets/entities/wallet.entity");
let Transaction = class Transaction {
    id;
    referenceNo;
    senderWalletId;
    senderWallet;
    receiverWalletId;
    receiverWallet;
    amount;
    fee;
    transactionType;
    status;
    description;
    createdAt;
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_no', unique: true }),
    __metadata("design:type", String)
], Transaction.prototype, "referenceNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sender_wallet_id', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "senderWalletId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet, wallet => wallet.sentTransactions, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sender_wallet_id' }),
    __metadata("design:type", wallet_entity_1.Wallet)
], Transaction.prototype, "senderWallet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receiver_wallet_id', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "receiverWalletId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet, wallet => wallet.receivedTransactions, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'receiver_wallet_id' }),
    __metadata("design:type", wallet_entity_1.Wallet)
], Transaction.prototype, "receiverWallet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Transaction.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_type' }),
    __metadata("design:type", String)
], Transaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)('transactions')
], Transaction);
//# sourceMappingURL=transaction.entity.js.map