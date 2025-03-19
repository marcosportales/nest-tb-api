import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameMedicionesTable1742426023653 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // queryRunner.renameTable('mediciones', 'measurements');
    queryRunner.query(`ALTER TABLE mediciones RENAME TO measurements`); // equivalente a lo anterior
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.renameTable('measurements', 'mediciones');
  }
}
