import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMedicionesTable1740876480307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mediciones',
        columns: [
          {
            name: 'variable_id',
            type: 'int',
            isPrimary: true,
            foreignKeyConstraintName: 'fk_mediciones',
          },
          {
            name: 'value',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'time',
            type: 'time',
            isPrimary: true,
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'mediciones',
      new TableForeignKey({
        columnNames: ['variable_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'variables',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP table mediciones');
  }
}
