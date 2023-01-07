import { schema, rules } from '@ioc:Adonis/Core/Validator'

export const sharedProjectRules = {
  name: schema.string([rules.minLength(3), rules.maxLength(100)])
}