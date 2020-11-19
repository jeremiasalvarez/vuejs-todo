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

    static async updateTodo(data) {

        try {
            
            const result = await pool.query("UPDATE tasks SET title=?, description=? WHERE id=?", [data.newTitle, data.newDescription, data.id]);

            return {
                success: result.affectedRows == 1,
                message: "Actualizado Correctamente"
            }

        } catch (error) {
            
            return {
                success: false,
                message: error.message
            }
        }
    }

    static async updateState(id, state) {

        try {
            
            const result = await pool.query("UPDATE tasks SET completed=? WHERE id=?",[state, id]);

            return {
                success: result.affectedRows == 1,
                message: "Tarea completada exitosamente"
            }

        } catch (error) {
            
            return {
                success: false,
                message: error.message
            }
        }
    }

    static async deleteTodo(id) {

        try {
            
            const result = await pool.query("DELETE FROM tasks WHERE id=?", [id]);

            return {
                success: result.affectedRows == 1,
                message: "Tarea eliminada exitosamente"
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
