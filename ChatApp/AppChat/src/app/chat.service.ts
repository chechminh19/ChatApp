import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/chat", {
    skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

  public messages$ = new BehaviorSubject<any[]>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public users: string[] = [];
  public rooms: string[] =[];
  constructor() {
    this.start();
    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string, room: string) => {   
      // Tạo đối tượng message mới
      const updateMess = { user, message, messageTime, room };

  // Thêm tin nhắn mới vào mảng messages
  this.messages = [...this.messages, updateMess]; // Cập nhật mảng với đối tượng tin nhắn mới

  // Cập nhật BehaviorSubject
  this.messages$.next(this.messages);  // Truyền mảng messages đã cập nhật cho BehaviorSubject
  });
  
    this.connection.on("ConnectedUsers", (users: string[])=>{
      try {
        console.log("Connected users received:", users);
        this.connectedUsers$.next(users);
    } catch (error) {
        console.error("Error handling ConnectedUsers event: ", error);
    }
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
            console.error("Stack trace:", error.stack);
        } else {
            console.error("Unknown error:", error);
        }
    }
}

  //Join Room
  public async joinRoom(user: string, room: string){
    try {
      await this.connection.invoke("JoinRoom", { user, room });
      console.log(`Joined room: ${room}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  }
  //send
  public async sendMessage(user: string, message: string, room: string) {  
    try {
      // Gửi tin nhắn qua SignalR
      await this.connection.invoke("SendMessage", message);
  
      // Tạo đối tượng cho tin nhắn đã gửi
      // const sentMessage = { 
      //   user: user,               // Sử dụng tên người dùng hiện tại
      //   message: message, 
      //   messageTime: new Date().toISOString(), 
      //         // Sử dụng phòng hiện tại
      // };
      
      // Thêm tin nhắn đã gửi vào mảng
      this.messages.push(message); 
      this.messages$.next(this.messages);  // Cập nhật BehaviorSubject
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  
  //leave
  public async leaveChat(){
    return this.connection.stop();
  }
}