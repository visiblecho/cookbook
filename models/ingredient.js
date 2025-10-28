import mongoose from 'mongoose'

const ingredientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

export default Ingredient