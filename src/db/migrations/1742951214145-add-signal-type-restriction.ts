import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSignalTypeRestriction1742951214145
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      ALTER TABLE variables
      ADD CONSTRAINT check_signal_type
      CHECK (signal_type in ('analogic'. 'digital'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      ALTER TABLE variables
      DROP CONSTRAINT check_signal_type
    `);
  }
}
