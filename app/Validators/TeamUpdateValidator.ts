import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TeamUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([rules.minLength(3), rules.maxLength(100)]),
    slug: schema.string.optional([rules.minLength(3), rules.maxLength(125)])
  })

  public messages: CustomMessages = {}
}
