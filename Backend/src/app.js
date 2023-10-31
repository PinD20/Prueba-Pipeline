const express = require('express');
const app = express(); 
const cors = require('cors');

app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 

const WorkoutRouter = require("./routes/workoutRoutes");

app.use("/", WorkoutRouter);

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Bienvenido al Backend' });
});

module.exports = app;