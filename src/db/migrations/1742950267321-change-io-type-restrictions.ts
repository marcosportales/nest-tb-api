import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeIoTypeRestrictions1742950267321
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropCheckConstraint('variables', 'check_io_type');

    await queryRunner.query(`
      ALTER TABLE variables
      ADD CONSTRAINT check_io_type
      CHECK (io_type IN ('input', 'output'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropCheckConstraint('variables', 'check_io_type');

    await queryRunner.query(`
      ALTER TABLE variables
      ADD CONSTRAINT check_io_type
      CHECK (io_type IN ('I', 'O'))
    `);
  }
}
