import express from 'express'
import morgan from 'morgan'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import 'dotenv/config'
import session from 'express-session'
import MongoStore from 'connect-mongo'

// * Controllers / Routers
import authRouter from './controllers/auth.js'

const app = express()

// * Middleware
app.use(express.urlencoded())
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}))

// * Routes
app.get('/', async (req, res) => {
  res.render('index.ejs', { user: req.session.user })
})

app.use('/auth', authRouter)

// * Connections
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('🔒 Database connection established')
  } catch (error) {
    console.error(error)
  }
}
connect()

app.listen(3000, () => console.log('🚀 Server running on port 3000'))