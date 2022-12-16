import Roles from "App/Enums/Roles";
import User from "App/Models/User";
import NamingService from "./NamingService";

export default class TeamService {
  public static async stubDefaultTeam(user: User) {
    const name = NamingService.getRandomName()
    const team = await user.related('teams').create({ name }, { role_id: Roles.ADMIN })

    await user.merge({
      lastAccessedTeamId: team.id
    }).save()

    return team
  }
}