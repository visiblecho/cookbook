import mongoose from 'mongoose'
import Ingredient from './ingredient.js'
import User from './user.js'

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  /*
  ingredients: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: Ingredient
  }
  */
})

const Recipe = mongoose.model('Recipe', recipeSchema)

export default Recipe