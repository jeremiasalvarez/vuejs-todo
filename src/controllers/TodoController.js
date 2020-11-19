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
        
        const data = { 
            title: req.body.title,
            description: req.body.description 
            }
        if (!data.title || !data.description) {
            return res.status(400).json({success: false, message: "No se completaron todos los campos"});
        }

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

    static async updateTodo(req, res) {

        const data = {
            id: req.body.id,
            newTitle: req.body.newTitle,
            newDescription: req.body.newDescription
        }

        if (!data.newTitle || !data.newDescription || !data.id) {
            return res.status(400).json({success: false, message: "No se completaron todos los campos"});
        }

        try {
            
            const result = await Todos.updateTodo(data);

            return res.json(result);

        } catch (error) {
            
            return res.json({
                success: false,
                message: error.message
            })
        }
    }

    static async switchState(req, res) {

        const id = req.body.id, state = req.body.state

        if (!Number.isInteger(id) || !Number.isInteger(state)) {
            
            return res.status(400).json({
                success: false,
                message: "Algo salio mal"
            })
        }
        try {
            
            const result = await Todos.updateState(id, state)

            return res.json(result)

        } catch (error) {
            
           return res.json({
               success: false,
               message: error.message
           })
        }
    }

    static async deleteTodo(req, res) {

        const id = req.body.id;

        if (!id) {
            return res.status(400).json({success: false, message: "Algo salio mal"})
        }

        try {
            
            const result = await Todos.deleteTodo(id);

            return res.json(result);

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
    createTodo: TodoController.newTodo,
    updateTodo: TodoController.updateTodo,
    switchState: TodoController.switchState,
    deleteTodo: TodoController.deleteTodo
}