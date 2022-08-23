import express from 'express';
import Joi from "joi";
import mongoose from "mongoose";

const router = express.Router()

const Course = mongoose.model('Course', new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        minLength: 5,
        maxLength: 50
    }
}))


router.get("/", async (req, res) => {
    const courses = await Course.find().sort('name')
    res.send(courses);
})

router.post("/", async (req, res) => {
    const {error, value, warning} = validateCourse(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    let course = new Course({
        name: req.body.name
    })
    //courses.push(course);
    course = await course.save()
    res.send(course);
})

router.put("/:id", async (req, res) => {
    const {error, value, warning} = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const course = await Course.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true})
    //const course = courses.find(c => c.id === parseInt(req.params.id))

    if (!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);

    //course.name = req.body.name
    res.send(course)
})
router.delete("/:id", async(req, res) => {
    const course = await Course.findByIdAndRemove(req.params.id)
    //const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);

    //courses.filter(c => c.id !== parseInt(course.id))
    // const index = courses.findIndex(c => c.id)
    // courses.splice(index, 1)
    res.send(course)
})

router.get("/:id", async (req, res) => {
    const course = await Course.findById(req.params.id)
   // const course = courses.find(c => c.id === parseInt(req.params.id))
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
