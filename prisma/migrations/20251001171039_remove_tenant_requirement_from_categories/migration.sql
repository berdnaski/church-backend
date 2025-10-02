-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_tenantId_fkey";

-- AlterTable
ALTER TABLE "public"."Category" ALTER COLUMN "tenantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
