import express from 'express'
import User from '../models/user.js'
import Recipe from '../models/recipe.js'
import { render } from 'ejs'
import session from 'express-session'

const router = express.Router()

// * Index	/recipes	GET
router.get('', async(req, res) => {
    const recipes = await Recipe.find()
    res.render('recipes/index', { recipes })
})

// * New	/recipes/new	GET
router.get('/new', (req, res) => res.render('recipes/new'))

// * Create	/recipes	POST
router.post('', async (req, res) => {
    req.body.owner = req.session.user._id
    const createdRecipe = await Recipe.create(req.body)
    console.log('Recipe created')
    res.redirect(`/recipes/${createdRecipe._id}`)
})

// * Show	/recipes/:recipeId	GET
router.get('/:id', async (req, res) => {
    const recipe = await Recipe.findById(req.params.id)
    console.log('Found')
    res.render('recipes/show', { recipe })
})

// * Edit	/recipes/:recipeId/edit	GET
// * Update	/recipes/:recipeId	PUT
// * Delete	/recipes/:recipeId	DELETE

export default router