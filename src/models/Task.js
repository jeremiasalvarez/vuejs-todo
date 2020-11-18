const pool = require("../../data/database");
const { Parser } = require("../util/Parser");

class Todos {
    
    static async all() {
        try {
            const rows = await pool.query("SELECT * FROM tasks");
            return {
                success: true,
                todos: Parser.toJson(rows)
            };

        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    static async createOne(data) {

        try {

            const todo = {
                title: data.title,
                description: data.description,
                completed: 0
            }

            const result = await pool.query("INSERT INTO tasks SET ?", [todo]);

            return {
                success: true,
                id: result.insertId
            }

        } catch (error) {
            
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = {
    Todos
}
