import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterVariablesTable1740878174753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE variables rename column name to nombre',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
