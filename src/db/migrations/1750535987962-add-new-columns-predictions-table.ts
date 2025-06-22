import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewColumnsPredictionsTable1750535987962
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE predictions ADD COLUMN predicted_value REAL NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE predictions DROP COLUMN predicted_value',
    );
  }
}
