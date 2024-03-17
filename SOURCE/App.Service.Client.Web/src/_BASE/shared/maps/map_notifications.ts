import { SystemNotification } from "../models/data/notification.model";
import { NotificationVTO } from "../models/view/NotificationVTO";

// use to pass this callback to a map method:
// eg:
// this.http.get<Product>()(url).pipe(map(data=>data.map(mapToProduct)));


//Should be using Automapper...
function mapToNotificationVTO(item: SystemNotification): NotificationVTO {

  var result : NotificationVTO = {
    id: item.id,
    iconId: "bx-badge-check",
    senderImageName: "avatar-1.jpg",
    checkboxId: "all-notification-check01",
    type: "Something",
    sender: "Mrs.Smith",
    state:true,
    sentUtc: new Date("2023-04-23T18:25:43.511Z"),
    subject: item.title,
    summary: item.description ? item.description.substring(0, 100) : '',
  }
  // Some additional logic to get avatar of person maybe

  return result;
}
