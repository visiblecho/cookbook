import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import isSignedOut from '../middleware/is-signed-out.js'

export const router = express.Router()

// * Routes

// * GET /auth/sign-up
// This route will render a web page with a form to create a user account
router.get('/sign-up', isSignedOut, (req, res) => {
  res.render('auth/sign-up.ejs')
})

// * POST /auth/sign-up
// This route expects a req.body in order to create a user in the database
router.post('/sign-up', async (req, res) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    // Check passwords match one another, send error response if they don't
    // Do this first to avoid unnecessary database calls
    if (password !== confirmPassword) return res.status(400).send('Passwords do not match.')

    // Next check if the username provided has already been used, send error response if so
    const usernameInDatabase = await User.findOne({ username: username })
    if (usernameInDatabase) return res.status(400).send('Username already taken')

    // Next check if the email provided has already been used, send error response if so
    const emailInDatabase = await User.findOne({ email: email})
    if (emailInDatabase) return res.status(400).send('Email already taken')

    // Just before creating the user, ensure the password is hashed
    req.body.password = bcrypt.hashSync(password, 12)

    // Create user if conditions met
    const createdUser = await User.create(req.body)
    console.log(createdUser)

    res.redirect('/auth/sign-in')
  } catch (error) {
    console.error(error)
    return res.status(500).send('Something went wrong. Please try again later.')
  }
})

// * GET /auth/sign-in
// This route will render the sign in form
router.get('/sign-in', isSignedOut, (req, res) => {
  res.render('auth/sign-in.ejs')
})

// * POST /auth/sign-in
// This route expects a req.body in order to search for a matching user
// Once verified, the user should be "signed in"
router.post('/sign-in', async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username })
    if (!existingUser) return res.status(401).send('The username provided was not found.')

    // If the user exists in our database, we now want to compare the plain text password from the user submitted form with the hash stored in the database
    if(!bcrypt.compareSync(req.body.password, existingUser.password)) {
      return res.status(401).send('Incorrect password was provided.')
    }

    // If the username exists and the correct password was provided, then sign the user in

    // To sign the user in, we must update the session store, for the cookie to be generated and sent back to the client
    req.session.user = {
      _id: existingUser._id,
      username: existingUser.username
    }

    // First wait for confirmation that the session has been updated with the user information, before redirecting to the home page
    // This ensures that the user does not see a logged out page when they are in fact logged in
    req.session.save(() => res.redirect('/'))

  } catch (error) {
    console.error(error)
    return res.status(500).send('Something went wrong. Please try again later.')
  }
})


// * GET /auth/sign-out
// This route will destroy the session in the database, effectively logging the user out
// It will then redirect to the home page
router.get('/sign-out', (req, res) => {
  // 1. Destroy the session
  req.session.destroy(() => {
    // 2. Redirect to the home page on completion
    res.redirect('/')
  })
})

export default router