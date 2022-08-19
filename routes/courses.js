import express from 'express';
import Joi from "joi";

const router = express.Router()

const courses = [
    {id: 1, name: 'Course1'},
    {id: 2, name: 'Course2'},
    {id: 3, name: 'Course3'},
    {id: 4, name: 'Course4'},
]


router.get("/", (req, res) => {
    res.send(courses);
})

router.post("/", (req, res) => {
    const {error, value, warning} = validateCourse(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

router.put("/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);

    const {error, value, warning} = validateCourse(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    course.name = req.body.name
    res.send(course)
})
router.delete("/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);

    //courses.filter(c => c.id !== parseInt(course.id))
    const index = courses.findIndex(c => c.id)
    courses.splice(index, 1)

    res.send(course)
})

router.get("/:id", (req, res) => {
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

export default router
