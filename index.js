import express from "express";
import log from "./middleware/logger.js";
import helmet from "helmet";
import morgan from "morgan"
import 'dotenv/config'
import Debug from 'debug'

import courseRoutes from "./routes/courses.js";

const startupDebugger = Debug('app:startup')
//const dbDebugger = Debug('app:db')

const app = express();

app.set('view engine', 'pug')
app.set('views', './views') // default

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(log)
app.use(helmet())

// Configuration
console.log("Application name: " + process.env.NAME)
console.log("Mail server: " + process.env.MAIL_HOST)
console.log("Mail Password: " + process.env.MAIL_PASSWORD)

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'))
    startupDebugger('Morgan enabled')
}

// DB Work
//dbDebugger('Connected to database...')

app.get("/", (req, res) => {
    res.render('index', {
        title: "My Express Application",
        message: "Hello World"
    });
});

// Courses Routes middleware
app.use('/api/courses', courseRoutes)


// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
