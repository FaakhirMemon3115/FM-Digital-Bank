-- FM Digital Bank - Database Setup Script
-- Run this in phpMyAdmin or MySQL command line

CREATE DATABASE IF NOT EXISTS fm_digital_bank CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fm_digital_bank;

-- NestJS TypeORM with synchronize:true will auto-create tables
-- Just creating the database is enough!

SELECT 'Database fm_digital_bank created successfully!' AS message;
