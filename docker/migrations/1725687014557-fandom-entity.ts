import { MigrationInterface, QueryRunner } from "typeorm";

export class FandomEntity1725687014557 implements MigrationInterface {
    name = 'FandomEntity1725687014557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fandom" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "avatar" character varying, "isApproved" boolean NOT NULL DEFAULT false, "authorId" uuid, "lastModifiedById" uuid, "approvedById" uuid, CONSTRAINT "UQ_ad7e35f31a87e0bc485913a709c" UNIQUE ("title"), CONSTRAINT "PK_a635d358322d7667775dbdd51b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fandom" ADD CONSTRAINT "FK_f35a285f5e7c4b32c6df00eb289" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fandom" ADD CONSTRAINT "FK_bc42cdd356202f660061406ec37" FOREIGN KEY ("lastModifiedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fandom" ADD CONSTRAINT "FK_7af1a4a1261c0fc1aaca88cff02" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fandom" DROP CONSTRAINT "FK_7af1a4a1261c0fc1aaca88cff02"`);
        await queryRunner.query(`ALTER TABLE "fandom" DROP CONSTRAINT "FK_bc42cdd356202f660061406ec37"`);
        await queryRunner.query(`ALTER TABLE "fandom" DROP CONSTRAINT "FK_f35a285f5e7c4b32c6df00eb289"`);
        await queryRunner.query(`DROP TABLE "fandom"`);
    }

}
