const express = require("express");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();
const app = express();

//Config
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use("/tasks", require("./routes/tasks"))

//Static 
const publicPath = path.join(__dirname, "/public");
app.use(express.static(publicPath))

//Init
const PORT = app.get('port');
app.listen(PORT, () => console.log(`Server en puerto ${PORT}`));


