import express from 'express';
import Joi from "joi";
import mongoose from "mongoose";

const router = express.Router()

const Customer = mongoose.model('Customer', new mongoose.Schema({
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


router.get("/", async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers);
})

router.post("/", async (req, res) => {
    const {error, value, warning} = validateCustomer(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    })
    //Customers.push(Customer);
    customer = await customer.save()
    res.send(customer);
})

router.put("/:id", async (req, res) => {
    const {error, value, warning} = validateCustomer(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true})
    //const Customer = Customers.find(c => c.id === parseInt(req.params.id))

    if (!customer) return res.status(404).send(`The Customer with id ${req.params.id} was not found`);

    //Customer.name = req.body.name
    res.send(Customer)
})
router.delete("/:id", async(req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    //const Customer = Customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) return res.status(404).send(`The Customer with id ${req.params.id} was not found`);

    //Customers.filter(c => c.id !== parseInt(Customer.id))
    // const index = Customers.findIndex(c => c.id)
    // Customers.splice(index, 1)
    res.send(customer)
})

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    // const Customer = Customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) return res.status(404).send(`The Customer with id ${req.params.id} was not found`);
    res.send(customer)
})

function validateCustomer(customer) {
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

export default router
