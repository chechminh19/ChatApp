import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl("https://chatappp-d8hqg8d0gpghhwgx.southeastasia-01.azurewebsites.net/chat", {
    skipNegotiation: false,
      transport: signalR.HttpTransportType.WebSockets
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();
  


  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public users: string[] = [];
  public rooms: string[] =[];
  constructor() {
    this.start();
    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string, room: string)=>{
      const updateMess = {user, message, messageTime, room}
      this.messages = [...this.messages, updateMess ];
      this.messages$.next(this.messages);
    });

    this.connection.on("ConnectedUser", (users: any)=>{
      this.connectedUsers$.next(users);
    });
   }
  // start connection
  public async start() {
    console.log("Attempting to start connection...");
    try {
        await this.connection.start();
        console.log("Connection is established!");
    } catch (error) {
        console.error("Error while starting connection: ", error);
        // Log chi tiết về lỗi
        if (error instanceof Error) {
            console.error("Error details:", error.message);
            console.error("Stack trace:", error.stack);  // Thêm stack trace để debug dễ hơn
        } else {
            console.error("Unknown error:", error);
        }
    }
}

  //Join Room
  public async joinRoom(user: string, room: string){
    return this.connection.invoke("JoinRoom", {user, room})
  }
  // Send Messages
  public async sendMessage(message: string){
    return this.connection
    .invoke("SendMessage", message)
  }
  //leave
  public async leaveChat(){
    return this.connection.stop();
  }
}