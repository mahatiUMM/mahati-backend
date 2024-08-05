/*
  Warnings:

  - Added the required column `author_name` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_url` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail_url` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_reminder_id_fkey`;

-- AlterTable
ALTER TABLE `reminders` ADD COLUMN `expired_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `videos` ADD COLUMN `author_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `author_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `height` INTEGER NOT NULL,
    ADD COLUMN `thumbnail_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `version` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_reminder_id_fkey` FOREIGN KEY (`reminder_id`) REFERENCES `reminders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
