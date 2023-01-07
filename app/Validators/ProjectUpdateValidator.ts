import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { sharedProjectRules } from './shared/ProjectRules'

export default class ProjectUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ...sharedProjectRules,
    slug: schema.string([
      rules.minLength(3), 
      rules.maxLength(150), 
      rules.unique({ 
        table: 'projects', 
        column: 'slug', 
        caseInsensitive: true,
        whereNot: {
          id: this.ctx.params.project
        }
      })
    ]),
    siteUrl: schema.string.optional([rules.url(), rules.normalizeUrl()])
  })

  public messages: CustomMessages = {}
}
