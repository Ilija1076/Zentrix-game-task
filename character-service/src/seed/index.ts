import { AppDataSource } from "../datasource";
import { seedClass } from "./classSeeder";
import { seedCharacter } from "./characterSeeder";
import { seedItem } from "./itemSeeder";

async function runSeeders(){
    await AppDataSource.initialize();

    await seedClass(AppDataSource);
    await seedItem(AppDataSource);
    await seedCharacter(AppDataSource);

    console.log("Database fully seeded.");
    process.exit(0);
}

runSeeders().catch((err) =>{
    console.log(err);
    process.exit(1);
});