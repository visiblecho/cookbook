import express from 'express'
import User from '../models/user.js'
import Recipe from '../models/recipe.js'

const router = express.Router()

// * Index	/recipes	GET
// * New	/recipes/new	GET
// * Create	/recipes	POST
// * Show	/recipes/:recipeId	GET
// * Edit	/recipes/:recipeId/edit	GET
// * Update	/recipes/:recipeId	PUT
// * Delete	/recipes/:recipeId	DELETE

export default router