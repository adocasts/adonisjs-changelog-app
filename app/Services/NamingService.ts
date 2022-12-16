import { uniqueNamesGenerator, animals, colors, names, starWars } from 'unique-names-generator';

export default class NamingService {
  public static getRandomName() {
    return uniqueNamesGenerator({
      dictionaries: [[...animals, ...colors], [...names, ...starWars]],
      length: 2,
      separator: ' ',
      style: 'capital'
    });
  }
}