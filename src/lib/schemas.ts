import Joi from 'joi'

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

export const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.ref('password')
})

export const ratingSchema = Joi.object({
    university: Joi.string().required(),
    rating: Joi.number().min(0).max(100).default(50).required(),
    comment: Joi.string().min(50)
})