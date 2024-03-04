// Import dependencies:
import { Injectable } from '@angular/core';

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class NotificationService {

  private allNotifications = [
    {
      id: 1,
      "title":"General",
      desc: "Students running in hallways",
      icon: "bx-badge-check",
      time: "Just 30 sec ago",
      checkboxId: "all-notification-check01",
      state: false
    },
    {
      id: 2,
      title: "Angela Bernier ",
      desc: "School bell still muted? 🔔.",
      img: "assets/images/users/avatar-2.jpg",
      icon: "bx-badge-check",
      time: "48 min ago",
      checkboxId: "all-notification-check02",
      state: false
    },
    {
      id: 3,
      title: "General",
      desc: "Parents are really mad!",
      icon: "bx-badge-check",
      time: "2 hrs ago",
      checkboxId: "all-notification-check03",
      state: false
    },
    {
      id: 4,
      title: "Maureen Gibsons",
      desc: "Maths results in.",
      img: "assets/images/users/avatar-8.jpg",
      icon: "bx-badge-check",
      time: "4 HRS ago",
      checkboxId: "all-notification-check04",
      state: false
    },
  ]

  private messages = [
    {
      id: 1,
      avatar: "assets/images/users/avatar-3.jpg",
      name: "James Lemire",
      message: "Algebra summer course?",
      time_ago: "30 min ago",
      checkboxId: "all-notification-check01",
      state: false

    },
    {
      id: 2,
      avatar: "assets/images/users/avatar-2.jpg",
      name: "Angela Bernier",
      message: "Blah blah blah... 🔔.",
      time_ago: "2 hrs ago",
      checkboxId: "all-notification-check02",
      state: false
    },
    {
      id: 3,
      avatar: "assets/images/users/avatar-6.jpg",
      name: "Kenneth Brown",
      message: "Sporting 📃 invoice #12501.",
      time_ago: "10 hrs ago",
      checkboxId: "all-notification-check03",
      state: false
    },
    {
      id: 4,
      avatar: "assets/images/users/avatar-8.jpg",
      name: "Maureen Gibson",
      message: "Called city about the water pipes.",
      time_ago: "3 days ago",
      checkboxId: "all-notification-check04",
      state: false
    }
  ];

  public getAll() {
    return this.allNotifications;
  }  
  public getMessages() {
      return this.messages;
    }  

}




