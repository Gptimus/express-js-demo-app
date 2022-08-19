import Joi from "joi"
import express from "express";
import log from "./logger.js";
import helmet from "helmet";
import morgan from "morgan"
import 'dotenv/config'

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(log)
app.use(helmet())

// Configuration
console.log("Application name: " + process.env.NAME)
console.log("Mail server: " + process.env.MAIL_HOST)
console.log("Mail Password: " + process.env.MAIL_PASSWORD)

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    console.log('Morgan enabled')
}

const courses = [
    {id: 1, name: 'Course1'},
    {id: 2, name: 'Course2'},
    {id: 3, name: 'Course3'},
    {id: 4, name: 'Course4'},
]

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
})

app.post("/api/courses", (req, res) => {
    const {error, value, warning} = validateCourse(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

app.put("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);

    const {error, value, warning} = validateCourse(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    course.name = req.body.name
    res.send(course)
})
app.delete("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);

    //courses.filter(c => c.id !== parseInt(course.id))
    const index = courses.findIndex(c => c.id)
    courses.splice(index, 1)

    res.send(course)
})

app.get("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);
    res.send(course)
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    })

    const {error, value, warning} = schema.validate(course)

    return {
        error,
        value,
        warning
    }
}

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
