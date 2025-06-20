import { DataSource } from "typeorm";
import { Character } from "../entity/Character";
import { Class } from "../entity/Class";

export async function seedCharacter(dataSource: DataSource) {
  const repo = dataSource.getRepository(Character);
  const classRepo = dataSource.getRepository(Class);

  const warriorClass = await classRepo.findOneBy({ name: "Warrior" });
  if (!warriorClass) return;

  const exists = await repo.findOneBy({ name: "SampleWarrior" });
  if (!exists) {
    await repo.save({
      name: "SampleWarrior",
      health: 100,
      mana: 20,
      baseStrength: 10,
      baseAgility: 5,
      baseIntelligence: 2,
      baseFaith: 1,
      createdBy: 1,
      class: warriorClass,
    });
  }
}