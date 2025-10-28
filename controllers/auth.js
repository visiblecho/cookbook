import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import isSignedOut from '../middleware/is-signed-out.js'

export const router = express.Router()

// * Routes

// * GET /auth/sign-up
// This route will render a web page with a form to create a user account
router.get('/sign-up', isSignedOut, (req, res) => {
  res.render('auth/sign-up')
})

// * POST /auth/sign-up
// This route expects a req.body in order to create a user in the database
router.post('/sign-up', async (req, res) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    if (password !== confirmPassword) return res.status(400).send('Passwords do not match.')

    const usernameInDatabase = await User.findOne({ username: username })
    if (usernameInDatabase) return res.status(400).send('Username already taken')

    const emailInDatabase = await User.findOne({ email: email})
    if (emailInDatabase) return res.status(400).send('Email already taken')

    req.body.password = bcrypt.hashSync(password, 12)

    const createdUser = await User.create(req.body)
    console.log(createdUser)

    res.redirect('/auth/sign-in')
  } catch (error) {
    console.error(error)
    return res.status(500).send('Something went wrong. Please try again later.')
  }
})

// * GET /auth/sign-in
router.get('/sign-in', isSignedOut, (req, res) => {
  res.render('auth/sign-in')
})

// * POST /auth/sign-in
// This route expects a req.body in order to search for a matching user
// Once verified, the user should be "signed in"
router.post('/sign-in', async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username })
    if (!existingUser) return res.status(401).send('The username provided was not found.')

    if(!bcrypt.compareSync(req.body.password, existingUser.password)) {
      return res.status(401).send('Incorrect password was provided.')
    }

    req.session.user = {
      _id: existingUser._id,
      username: existingUser.username
    }

    req.session.save(() => res.redirect('/'))

  } catch (error) {
    console.error(error)
    return res.status(500).send('Something went wrong. Please try again later.')
  }
})


// * GET /auth/sign-out
router.get('/sign-out', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

export default router