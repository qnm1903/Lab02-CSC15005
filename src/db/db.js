import { db, pgp } from '../configs/pgp.config.js'
export default (schema) => {
    return {
        all: async (tbName) => {
            try {
                const query = `SELECT * FROM "${schema}"."${tbName}"`;
                const data = await db.any(query);
                return data;
            } catch (error) {
                console.error(`Error fetching all from ${tbName}:`, error.message);
                throw new Error('Error fetching data');
            }
        },

        one: async (tbName, colName, value) => {
            try {
                const query = `
                    SELECT *
                    FROM "${schema}"."${tbName}"
                    WHERE "${colName}" = $1
                `;
                const data = await db.oneOrNone(query, [value]);
                return data;
            } catch (error) {
                console.error(`Error fetching one from ${tbName}:`, error.message);
                throw new Error('Error fetching data');
            }
        },

        add: async (tbName, columns = null, item) => {
            try {
                const query = pgp.helpers.insert(item, columns, { table: tbName, schema });
                const data = await db.none(query);
                return { success: true, data: data };
            } catch (error) {
                console.error(`Error inserting into ${tbName}:`, error.message);
                throw new Error('Error inserting data');
            }
        },

        addOne_return: async (tbName, item, columns = null) => {
            try {
                const query = pgp.helpers.insert(item, columns, { table: tbName, schema }) + " RETURNING *";
                return await db.oneOrNone(query);
            } catch (error) {
                console.error(`Error inserting into ${tbName}:`, error.message);
                throw new Error('Error inserting data');
            }
        },

        update: async (tbName, item, colNames, conditions) => {
            try {
                const set = pgp.helpers.update(item, null, new pgp.helpers.TableName({ table: tbName, schema: schema }));
                const whereClause = colNames.map((col, index) => `"${col}" = $${index + 1}`).join(' AND ');
                const sql = `${set} WHERE ${whereClause} RETURNING *`;
                const data = await db.oneOrNone(sql, conditions);

                if (data) {
                    return { success: true };
                }
                return { success: false };
            } catch (error) {
                console.error(`Error updating ${tbName}:`, error.message);
                throw new Error('Error updating data');
            }
        },


        amount: async (tbName) => {
            try {
                const query = `SELECT COUNT(*) FROM "${schema}"."${tbName}"`;
                const result = await db.query(query);
                return result;
            } catch (error) {
                console.error(`Error fetching count from ${tbName}:`, error);
                throw error;
            }
        },

        delete: async (tbName, condition) => {
            try {
                const isString = typeof condition.value === 'string';

                const query = `DELETE FROM "${schema}"."${tbName}" WHERE ${condition.column} = ${isString ? `'${condition.value}'` : condition.value}`;
                await db.none(query);
                return { success: true };
            } catch (error) {
                console.error(`Error deleting ${tbName}:`, error.message);
                throw new Error('Error deleting data');
            }
        },

        native: async (query, params) => {
            try {
                return await db.any(query, params);
            } catch (error) {
                console.log("Error executing native query: ", query);
                throw new Error("Error query");
            }
        },
    };
};


