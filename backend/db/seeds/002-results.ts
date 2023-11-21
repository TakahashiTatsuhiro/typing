import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("results").del();

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    // Inserts seed entries
    await knex("results").insert([
        { user_id: 2 ,score:25, date: new Date(now.getTime() - 4 * oneDay) },
        { user_id: 2 ,score:27, date: new Date(now.getTime() - 3 * oneDay)},
        { user_id: 2 ,score:32, date: new Date(now.getTime() - 2 * oneDay)},
        { user_id: 2 ,score:29, date: new Date(now.getTime() - 1 * oneDay)},
        { user_id: 3 ,score:35, date: new Date(now.getTime() - 2 * oneDay)},
        { user_id: 3 ,score:44, date: new Date(now.getTime() - 1 * oneDay)},
    ]);
};
