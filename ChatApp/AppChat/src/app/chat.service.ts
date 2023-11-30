import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/chat" ,{
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();
  
  public messages$ = new BehaviorSubject<any>([]);
  public connectedUser$ = new BehaviorSubject<string[]>([]);
  public messages : any[] = [];
  public users : string[] = []; 
  public rooms : string[] = [];

  constructor() {
    this.start();
    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string,room: string)=>{
      // console.log("User:", user);
      // console.log("Message:", message);
      // console.log("MessageTime:", messageTime);
      
      this.messages = [...this.messages, {user, message, messageTime,room}]; 
      this.messages$.next(this.messages);
    })
    this.connection.on("ConnnectedUser",(user: any)=>{
      //console.log("User:", user);
      this.connectedUser$.next(this.users);
    })
   }
  //start connection
  public async start(){
    try{
      await this.connection.start();
      console.log("Connection is established !");
    }catch(error){
      console.log(error);      
    }
  }
  //join room
  public async joinRoom(user:string, room:string){
    return this.connection.invoke("JoinRoom", {user,room});
  }
  //send message
  public async sendMessage(message: string){
    return this.connection.invoke("SendMessage", message);
  }
  //leave
  public async leaveChat(){
    return this.connection.stop();
  }
}
