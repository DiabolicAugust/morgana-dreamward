import { MigrationInterface, QueryRunner } from "typeorm";

export class FragmentEntity1726404528519 implements MigrationInterface {
    name = 'FragmentEntity1726404528519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fragment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "epigraph" character varying, "title" character varying NOT NULL, "contentNumber" integer NOT NULL, "relatedDreamId" uuid, "lastModifiedById" uuid, "authorId" uuid, CONSTRAINT "PK_e37acdc235671f92a25fca93e22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fragment" ADD CONSTRAINT "FK_dbfd0b0300de1284e2ead1fbe66" FOREIGN KEY ("relatedDreamId") REFERENCES "dream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fragment" ADD CONSTRAINT "FK_a6153c5ed1425dff6d7aaae6dfc" FOREIGN KEY ("lastModifiedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fragment" ADD CONSTRAINT "FK_80133979a010dd759487db4aef9" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fragment" DROP CONSTRAINT "FK_80133979a010dd759487db4aef9"`);
        await queryRunner.query(`ALTER TABLE "fragment" DROP CONSTRAINT "FK_a6153c5ed1425dff6d7aaae6dfc"`);
        await queryRunner.query(`ALTER TABLE "fragment" DROP CONSTRAINT "FK_dbfd0b0300de1284e2ead1fbe66"`);
        await queryRunner.query(`DROP TABLE "fragment"`);
    }

}
