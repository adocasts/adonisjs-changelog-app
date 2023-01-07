import Roles from "App/Enums/Roles";
import User from "App/Models/User";
import TeamStoreValidator from "App/Validators/TeamStoreValidator";

export default class TeamService {
  public static async stubDefaultTeam(user: User) {
    const name = `${user.username}'s Team`
    const team = await user.related('teams').create({ name }, { role_id: Roles.ADMIN })

    await user.merge({
      lastAccessedTeamId: team.id
    }).save()

    return team
  }

  public static async createTeam(user: User, data: TeamStoreValidator['schema']['props']) {
    return user.related('teams').create(data, { role_id: Roles.ADMIN})
  }
}