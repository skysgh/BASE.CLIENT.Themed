import { SystemNotification } from "../core/models/data/notification.model";
import { NotificationVTO } from "../core/models/view/NotificationVTO";
import { ObjectMappingService } from "../core/services/objectMapping.service";

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
