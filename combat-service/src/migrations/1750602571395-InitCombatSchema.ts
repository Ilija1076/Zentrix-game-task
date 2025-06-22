import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCombatSchema1750602571395 implements MigrationInterface {
    name = 'InitCombatSchema1750602571395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "duel" ("id" SERIAL NOT NULL, "characterAId" integer NOT NULL, "characterBId" integer NOT NULL, "currentTurnCharId" integer NOT NULL, "characterAHealth" integer NOT NULL, "characterBHealth" integer NOT NULL, "characterAMana" integer NOT NULL, "characterBMana" integer NOT NULL, "winnerId" character varying, "isDraw" character varying, "startTime" TIMESTAMP NOT NULL DEFAULT now(), "endTime" TIMESTAMP, CONSTRAINT "PK_1575a4255b3bdf1f11398841d0d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "duel"`);
    }

}
