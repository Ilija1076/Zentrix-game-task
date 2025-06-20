import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCharacterSchema1750436208361 implements MigrationInterface {
    name = 'InitCharacterSchema1750436208361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "class" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_574dd394846fb85d495d0f77dfd" UNIQUE ("name"), CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "bonusStrength" integer NOT NULL DEFAULT '0', "bonusAgility" integer NOT NULL DEFAULT '0', "bonusIntelligence" integer NOT NULL DEFAULT '0', "bonusFaith" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_c6ae12601fed4e2ee5019544ddf" UNIQUE ("name"), CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "character" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "health" integer NOT NULL, "mana" integer NOT NULL, "baseStrength" integer NOT NULL, "baseAgility" integer NOT NULL, "baseIntelligence" integer NOT NULL, "baseFaith" integer NOT NULL, "createdBy" integer NOT NULL, "classId" integer, CONSTRAINT "UQ_d80158dde1461b74ed8499e7d89" UNIQUE ("name"), CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "characterItems" ("characterId" integer NOT NULL, "itemId" integer NOT NULL, CONSTRAINT "PK_63ce176a99c945bfe59fb92a4c5" PRIMARY KEY ("characterId", "itemId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f10171759b84a7e3c47219cb25" ON "characterItems" ("characterId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5937df225045a4185d0ecef35d" ON "characterItems" ("itemId") `);
        await queryRunner.query(`ALTER TABLE "character" ADD CONSTRAINT "FK_a94ac46b7a3d853ac1a8c6a8b82" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characterItems" ADD CONSTRAINT "FK_f10171759b84a7e3c47219cb255" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "characterItems" ADD CONSTRAINT "FK_5937df225045a4185d0ecef35d8" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characterItems" DROP CONSTRAINT "FK_5937df225045a4185d0ecef35d8"`);
        await queryRunner.query(`ALTER TABLE "characterItems" DROP CONSTRAINT "FK_f10171759b84a7e3c47219cb255"`);
        await queryRunner.query(`ALTER TABLE "character" DROP CONSTRAINT "FK_a94ac46b7a3d853ac1a8c6a8b82"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5937df225045a4185d0ecef35d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f10171759b84a7e3c47219cb25"`);
        await queryRunner.query(`DROP TABLE "characterItems"`);
        await queryRunner.query(`DROP TABLE "character"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "class"`);
    }

}
