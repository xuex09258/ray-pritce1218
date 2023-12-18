
//mongoose.connect('mongodb+srv://ithelp:6jphCyvQ6jfRRsb@cluster0.nnqcnm1.mongodb.net/?retryWrites=true&w=majority')
//  .then(() => console.log('Connected to MongoDB...'))

  const express = require('express');
  const mongoose = require('mongoose');
  const app = express();
  
  
  let connectStatus = false;
  
  async function connectMongoDB () {
    try {
      await mongoose.connect('mongodb+srv://ithelp:6jphCyvQ6jfRRsb@cluster0.nnqcnm1.mongodb.net/?retryWrites=true&w=majority')
      console.log('Connected to MongoDB...')
      connectStatus = true;
    } catch (error) {
      console.log(error)
    }
  }
  
  connectMongoDB()
  
  const data = [];
  
  app.use(express.json());
  
  app.use((req, res, next) => {
    if (connectStatus) {
      next();
    } else {
      res.status(503).send({
        status: false,
        message: 'Server is not ready'
      });
    }
  })
  
  const todoSchema = new mongoose.Schema({
    id: Number,
    title: String,
    completed: Boolean,
  });
  
  const Todo = mongoose.model('Todo', todoSchema);
  
  //day6:   postman:     get       http://localhost:3000/todos
  app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.send({
      status: true,
      data: todos,
    });
  });
  //day6:   postman:     post       http://localhost:3000/todos
  app.post('/todos', async (req, res) => {
    const { title, completed } = req.body;
  
    const todo = new Todo({
      id: new Date().getTime(),
      title,
      completed,
    });
  
    await todo.save();
    res.send({
      status: true,
      message: 'Create todo successfully',
    });
  });
  
  app.listen(3000)