// Task1: initiate app and run server at 3000

const path=require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Essential for connecting front-end and back-end

const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or 3000

// Middleware to handle JSON requests and enable CORS
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 
const MONGO_URI = 'mongodb+srv://<username>:<password>@clustername.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected Successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));


// --- MONGOOSE SCHEMA AND MODEL ---
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
});

const Employee = mongoose.model('Employee', employeeSchema);
// --- END OF SCHEMA ---




//Task 2 : write api with error handling and appropriate api mentioned in the TODO below
//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving employee list', error: err.message });
    }
});

//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving employee', error: err.message });
    }
});
//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ message: 'Error adding new employee', error: err.message });
    }
});
//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting employee', error: err.message });
    }
});
//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', async (req, res) => {
    try {
        // Assuming the front end sends the MongoDB _id in the request body for updates
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.body._id,
            req.body,
            { new: true, runValidators: true } // Return the updated doc and run schema validation
        );
        
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found for update' });
        }
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: 'Error updating employee', error: err.message });
    }
});
//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});




