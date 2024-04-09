import { SystemStorage } from "./contracts/system.storage";
import { systemDbStorage } from "./system.storage.db";
import { systemSystemStorage } from "./system.storage.storage";


export const systemStorage: SystemStorage = {
  db: systemDbStorage,
  system: systemSystemStorage,
}
