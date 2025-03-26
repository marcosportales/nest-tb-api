import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeIoTypeDatatype1742996492644 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE variables ALTER COLUMN io_type TYPE VARCHAR(6)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE variables ALTER COLUMN io_type TYPE CHARACTER(1)',
    );
  }
}
