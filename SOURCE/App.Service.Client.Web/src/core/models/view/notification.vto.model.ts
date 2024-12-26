import { ReferenceDataBase } from "../data/base/ReferenceDataBase";


//  {
//    checkboxId: "all-notification-check02",
//    state: false
//  },

export class NotificationVTO {

  

    public id: any;
    public type: string = '';
    public sentUtc: Date = new Date();
    public state: boolean = true;

    public sender: string = '';
  public senderImageName: string = ''; //"{{system.sources.assets.private.dynamic.userdata.images.users}}avatar-2.jpg",
    public iconId: string = '';
  public checkboxId: string = ''; //"all-notification-check02"

    public subject: string = '';
    public summary: string = '';
}
