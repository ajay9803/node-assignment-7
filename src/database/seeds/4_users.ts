import { Knex } from "knex";

const TABLE_NAME = "users";

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
          name: "Admin",
          email: "admin@gmail.com",
          password:
            "$2b$10$qU4R6tjzgsJIRYNEuzGSAO7cL2qDGg2.N4QMw0w2GXQvA1hM36R2W",
          role_id: 1,
        },
        {
          id: 2,
          name: "Test",
          email: "test1@gmail.com",
          password:
            "$2b$10$qU4R6tjzgsJIRYNEuzGSAO7cL2qDGg2.N4QMw0w2GXQvA1hM36R2W",
          role_id: 2,
        },
      ]);
    });
}
