-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_departmentId_fkey";

-- AlterTable
ALTER TABLE "public"."UserRole" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
