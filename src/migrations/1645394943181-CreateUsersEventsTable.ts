import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersEventsTable1645394943181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_events',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'event_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'fk_users_events_users',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'fk_users_events_events',
            referencedTableName: 'events',
            referencedColumnNames: ['id'],
            columnNames: ['event_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users_events', true, true, true);
  }
}
