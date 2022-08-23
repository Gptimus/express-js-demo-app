import mongoose from "mongoose";
import Joi from "joi";

export const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    isGold: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
}))


export function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    })

    const {error, value, warning} = schema.validate(customer)

    return {
        error,
        value,
        warning
    }
}

