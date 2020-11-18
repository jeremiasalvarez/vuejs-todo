const Task = require("../models/Task.js");
const { Todos } = require("../models/Task.js");

class TodoController {

    static async getTodos(req, res) {
        try {      
            const { success , todos } = await Todos.all();
            return res.json({success, todos});

        } catch (error) {
            return res.json({success: false, error: error.message})
        }
    }

    static async newTodo(req, res) {
        
        const { data } = req.body;

        try {
            const result = await Todos.createOne(data);

            if (result.success) {
                return res.json({
                    success: true,
                    message: "Insertado",
                    id: result.id
                })
            } else {
                return res.json({
                    success: false, 
                    message: "Algo salio mal"
                })
            }
        } catch (error) {
            
            return res.json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = { 
    getTodos: TodoController.getTodos,
    createTodo: TodoController.newTodo
}