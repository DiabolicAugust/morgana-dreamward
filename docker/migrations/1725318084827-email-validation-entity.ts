import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailValidationEntity1725318084827 implements MigrationInterface {
    name = 'EmailValidationEntity1725318084827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "token" character varying, "expiresAt" TIMESTAMP, "isUsed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_3ffc9210f041753e837b29d9e5b" UNIQUE ("email"), CONSTRAINT "PK_b985a8362d9dac51e3d6120d40e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerificationId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_9a39d39bc377b6bcc8c7050af43" UNIQUE ("emailVerificationId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9a39d39bc377b6bcc8c7050af43" FOREIGN KEY ("emailVerificationId") REFERENCES "email_verification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9a39d39bc377b6bcc8c7050af43"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_9a39d39bc377b6bcc8c7050af43"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerificationId"`);
        await queryRunner.query(`DROP TABLE "email_verification"`);
    }

}
