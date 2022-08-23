import mongoose from "mongoose";
import Joi from "joi";

export const Course = mongoose.model('Course', new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        minLength: 5,
        maxLength: 50
    }
}))

export function validateCourse(course) {
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