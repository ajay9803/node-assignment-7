import { Knex } from 'knex';

const TABLE_NAME = 'permissions';

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          id: 1,
          permission_name: "users.create",
        },
        {
          id: 2,
          permission_name: "users.update",
        },
        {
          id: 3,
          permission_name: "users.delete",
        },
        {
          id: 4,
          permission_name: "users.fetch",
        },
        {
          id: 5,
          permission_name: "todos.create",
        },
        {
          id: 6,
          permission_name: "todos.update",
        },
        {
          id: 7,
          permission_name: "todos.delete",
        },
        {
          id: 8,
          permission_name: "todos.fetch",
        },
      ]);
    });
}