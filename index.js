const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const app = express();
const Joi = require('joi');

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

// Get Data
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id',(req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("Course Not Found");
    res.send(course); 
});

// Post/Add Data
app.post('/api/courses', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

// Put/Update Data
app.put('/api/courses/:id',(req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("Course Not Found");

    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);

});

//Delete Data
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("Course Not Found");

    const index = courses.indexOf(course);  
    courses.splice(index, 1);

    res.send(course);
});

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on PORT: ${port} || Running http://localhost:${port}`));