import { SystemNotification } from "./models/data/notification.model";
import { NotificationVTO } from "./models/view/NotificationVTO";
import { ObjectMappingService } from "./services/objectMapping.service";

class InitialiseMapsService{

  constructor(private objectMappingService: ObjectMappingService) {
    this.init();
  }

  protected init(): void {
    // This is going to become one massive clusterfuck of a file
    // before we get anywhere...
    // And what about late loaded modules?
    this.objectMappingService.createAndRegisterMap(SystemNotification, NotificationVTO);
  }
}
