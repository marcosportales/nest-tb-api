import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVariablesTable1740875362592 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'variables',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'signal_type',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },
          {
            name: 'io_type',
            type: 'char',
            length: '1',
            isNullable: true,
            enum: ['I', 'O'],
          },
          {
            name: 'structure_name',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE variables');
  }
}
