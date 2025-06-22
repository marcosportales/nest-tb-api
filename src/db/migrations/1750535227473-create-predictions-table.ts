import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePredictionsTable1750335367359 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'predictions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'intern temperature',
            type: 'real',
          },
          {
            name: 'input temperature',
            type: 'real',
          },
          {
            name: 'output temperature',
            type: 'real',
          },
          {
            name: 'chimney temperature',
            type: 'real',
          },
          {
            name: 'fan speed',
            type: 'real',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE predictions');
  }
}
