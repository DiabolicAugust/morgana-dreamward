import { MigrationInterface, QueryRunner } from "typeorm";

export class TagEntity1726071274670 implements MigrationInterface {
    name = 'TagEntity1726071274670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "isApproved" boolean NOT NULL DEFAULT false, "authorId" uuid, "lastModifiedById" uuid, "approvedById" uuid, CONSTRAINT "UQ_ea660f2baf9c3f3141d7c2ef531" UNIQUE ("title"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_9e7e912c496407e930276dff88c" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_5ce392fae3469b20d7b93a3f794" FOREIGN KEY ("lastModifiedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_e203072544c2769bf20478bd870" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_e203072544c2769bf20478bd870"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_5ce392fae3469b20d7b93a3f794"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_9e7e912c496407e930276dff88c"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
