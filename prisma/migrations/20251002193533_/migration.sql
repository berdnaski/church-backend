/*
  Warnings:

  - The `role` column on the `UserRole` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."UserRole" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRoleType" NOT NULL DEFAULT 'MEMBER',
ALTER COLUMN "updatedAt" DROP DEFAULT;
