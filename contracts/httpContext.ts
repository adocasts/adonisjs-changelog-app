declare module '@ioc:Adonis/Core/HttpContext' {
  import Team from 'App/Models/Team'
  import Project from 'App/Models/Project'

  interface HttpContextContract {
    team: Team | null | undefined,
    project: Project | null | undefined,
    flags: {
      usingLastAccessedTeam: boolean,
      usingLastAccessedProject: boolean
    }
  }
}