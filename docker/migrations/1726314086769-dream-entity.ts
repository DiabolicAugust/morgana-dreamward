import { MigrationInterface, QueryRunner } from "typeorm";

export class DreamEntity1726314086769 implements MigrationInterface {
    name = 'DreamEntity1726314086769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dream_status_enum" AS ENUM('frozen', 'unpublished', 'ongoing', 'completed', 'canceled')`);
        await queryRunner.query(`CREATE TYPE "public"."dream_maturerating_enum" AS ENUM('G', 'PG-13', 'R', 'NC-17', 'NC-21')`);
        await queryRunner.query(`CREATE TABLE "dream" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying, "cover" character varying, "publicationDate" date, "status" "public"."dream_status_enum" NOT NULL DEFAULT 'unpublished', "matureRating" "public"."dream_maturerating_enum" NOT NULL DEFAULT 'PG-13', "bookNumber" integer, "fandomId" uuid, CONSTRAINT "PK_d12349ee35ed0f8338f4883e81d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dream_author_user" ("dreamId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_3d15fe050490bebaae2566116ea" PRIMARY KEY ("dreamId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d618038099486589b442b844ca" ON "dream_author_user" ("dreamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0541f7ad383b97c0e910882562" ON "dream_author_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "dream_tags_tag" ("dreamId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_da91c1d93c32e9fc095401b7dec" PRIMARY KEY ("dreamId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f4e866f46771a68e5fea4eb06c" ON "dream_tags_tag" ("dreamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9e165dc1d91c3119ae15c2591" ON "dream_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "dream" ADD CONSTRAINT "FK_5f1082533a54f108b817c9d14b8" FOREIGN KEY ("fandomId") REFERENCES "fandom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dream_author_user" ADD CONSTRAINT "FK_d618038099486589b442b844ca1" FOREIGN KEY ("dreamId") REFERENCES "dream"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dream_author_user" ADD CONSTRAINT "FK_0541f7ad383b97c0e910882562d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dream_tags_tag" ADD CONSTRAINT "FK_f4e866f46771a68e5fea4eb06c4" FOREIGN KEY ("dreamId") REFERENCES "dream"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dream_tags_tag" ADD CONSTRAINT "FK_e9e165dc1d91c3119ae15c2591a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dream_tags_tag" DROP CONSTRAINT "FK_e9e165dc1d91c3119ae15c2591a"`);
        await queryRunner.query(`ALTER TABLE "dream_tags_tag" DROP CONSTRAINT "FK_f4e866f46771a68e5fea4eb06c4"`);
        await queryRunner.query(`ALTER TABLE "dream_author_user" DROP CONSTRAINT "FK_0541f7ad383b97c0e910882562d"`);
        await queryRunner.query(`ALTER TABLE "dream_author_user" DROP CONSTRAINT "FK_d618038099486589b442b844ca1"`);
        await queryRunner.query(`ALTER TABLE "dream" DROP CONSTRAINT "FK_5f1082533a54f108b817c9d14b8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9e165dc1d91c3119ae15c2591"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4e866f46771a68e5fea4eb06c"`);
        await queryRunner.query(`DROP TABLE "dream_tags_tag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0541f7ad383b97c0e910882562"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d618038099486589b442b844ca"`);
        await queryRunner.query(`DROP TABLE "dream_author_user"`);
        await queryRunner.query(`DROP TABLE "dream"`);
        await queryRunner.query(`DROP TYPE "public"."dream_maturerating_enum"`);
        await queryRunner.query(`DROP TYPE "public"."dream_status_enum"`);
    }

}
