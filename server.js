import express from 'express'
import morgan from 'morgan'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import 'dotenv/config'
import session from 'express-session'
import MongoStore from 'connect-mongo'

// * Middleware / Controllers / Routers
import authRouter from './controllers/auth.js'
import recipesRouter from './controllers/recipes.js'
import ingredientsRouter from './controllers/ingredients.js'
import passUserToView from './middleware/pass-user-to-view.js'
import isSignedIn from './middleware/is-signed-in.js'

const app = express()
app.set('view engine', 'ejs')

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

app.use(passUserToView)

// * Routes
app.get('/', async (req, res) => {
  res.render('index')
})

app.use('/auth', authRouter)

app.use(isSignedIn)

app.use('/recipes', recipesRouter)
app.use('/ingredients', ingredientsRouter)

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