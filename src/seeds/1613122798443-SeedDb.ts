import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1613122798443 implements MigrationInterface {
  name = 'SeedDb1613122798443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );

    await queryRunner.query(
      // password is 123
      `INSERT INTO users (username, email, password) VALUES ('wale', 'wale@example.com', '$2b$10$2pbG8Uzq7zIxgl1Il6EO1elwlHoUNZUGkJod4uJ4UeIJWu5U26I9C')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first article', 'First article', 'first article description', 'first article body', 'coffee,dragons', 1), ('second article', 'second article', 'second article description', 'second article body', 'coffee,dragons', 1)`,
    );
  }

  public async down(): Promise<void> {}
}
