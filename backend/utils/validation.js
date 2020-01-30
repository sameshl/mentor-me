// Package for validation
const Joi = require('@hapi/joi')

/* // Register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(6).required()
  })

  return schema.validate(data)
}

// Login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(6).required()
  })

  return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation */

const emailValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).email().required()
  })
  const { error } = schema.validate(data.email)
  if (error) { return error } else { return null }
}

const nameValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required()
  })
  const { error } = schema.validate(data.name)
  if (error) { return error } else { return null }
}

const passwordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required()
  })
  const { error } = schema.validate(data.password)
  if (error) { return error } else { return null }
}

module.exports.emailValidation = emailValidation
module.exports.nameValidation = nameValidation
module.exports.passwordValidation = passwordValidation
