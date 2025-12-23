import { TBaseConfiguration } from "../../core/base/configuration/t.base.configuration";
import { TBaseConstantsApis } from "../../core/base/constants/t.base.constants.apis";


export type TSitesConstantsApisTodo = TBaseConstantsApis & {
    statements: string;
    agreements: string;
    templateItems: string;
    templateSubItems: string;
    licenses: string;
    subscriptions: string;
    notificationDisplayItem: string;
    todo_tasks: string;
};
