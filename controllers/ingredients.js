import express from 'express'
import User from '../models/user.js'
import Ingredient from '../models/ingredient.js'

const router = express.Router()

// * Index	/ingredients	GET
// * New	/ingredients/new	GET
// * Create	/ingredients	POST
// * Show	/ingredients/:ingredientId	GET
// * Edit	/ingredients/:ingredientId/edit	GET
// * Update	/ingredients/:ingredientId	PUT
// * Delete	/ingredients/:ingredientId	DELETE

export default router