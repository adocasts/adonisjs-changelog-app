import Project from "App/Models/Project";
import Team from "App/Models/Team";
import User from "App/Models/User";

export default class UserService {
  public static async tryPopulateUserTeamProjects(user: User, teamId: number, projectId: number | undefined) {
    let project: Project | null | undefined = null
    let queryTeamId = teamId ?? user.lastAccessedTeamId!
    let isLastAccessedTeam = user.lastAccessedTeamId === queryTeamId
    
    const teams = await user.related('teams').query().orderBy('name')

    const team = await user.related('teams').query()
      .where('teams.id', queryTeamId)
      .preload('projects', query => query.withCount('team').orderBy('name'))
      .first()

    if (team && projectId) {
      project = await team?.related('projects').query()
        .where('id', projectId)
        .first()
    } else if (team && user.lastAccessedProjectId) {
      project = await team?.related('projects').query()
        .where('id', user.lastAccessedProjectId)
        .first()
    } else {
      project = await team?.related('projects').query().first()
    }

    return { team, project, teams, isLastAccessedTeam }
  }

  public static async updateLastAccessed(user: User, team: Team | null | undefined, project: Project | null | undefined) {
    user.lastAccessedTeamId = team?.id || null
    user.lastAccessedProjectId = project?.id || null
    await user.save()
  }
}