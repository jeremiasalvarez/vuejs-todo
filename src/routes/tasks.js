const express = require("express");
const router = express.Router();
const { getTodos, createTodo, updateTodo, switchState, deleteTodo } = require("../controllers/TodoController");


router.get("/", getTodos)

router.post("/create", createTodo)

router.post("/update", updateTodo)

router.post("/switch_state", switchState)

router.post("/delete", deleteTodo)

module.exports = router;