import { SystemDbStorage } from "./system.storage.db";
import { SystemSystemStorage } from "./system.storage.system";


export interface SystemStorage {
    db: SystemDbStorage;
    system: SystemSystemStorage;
}
