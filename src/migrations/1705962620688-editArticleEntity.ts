import { MigrationInterface, QueryRunner } from "typeorm";

export class EditArticleEntity1705962620688 implements MigrationInterface {
    name = 'EditArticleEntity1705962620688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "title" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "title"`);
    }

}
