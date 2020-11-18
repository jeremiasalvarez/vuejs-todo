const express = require("express");
const router = express.Router();
const { getTodos, createTodo } = require("../controllers/TodoController");


router.get("/", getTodos)

router.post("/create", createTodo)

module.exports = router;