import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {


  chatService = inject(ChatService);
  inputMessage = "";
  messages: any[] = [];
  router = inject(Router);
  loggedInUserName = sessionStorage.getItem("user");
  currentRoomName = sessionStorage.getItem("room");
  isRoomNameChanged: boolean = false; 
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;


  ngOnInit(): void {
    this.chatService.messages$.subscribe(res => {
      console.log('Received messages:', res); // Log toàn bộ dữ liệu nhận được
      this.messages = res;
      // this.currentRoomName = this.messages[0]?.room || '';
      // this.isRoomNameChanged = this.currentRoomName !== undefined;
      // console.log(this.messages);
      // console.log('Current Room:', this.currentRoomName); // Log room để kiểm tra
      if (res.length > 0) {
        const newRoom = res[0]?.room || '';
        if (newRoom && newRoom !== this.currentRoomName) {
          this.currentRoomName = newRoom;
          this.isRoomNameChanged = true;
          console.log('Updated Current Room:', this.currentRoomName);
        }
      }
    });
  }  
  
  ngAfterViewChecked(): void {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  sendMessage() {
    
    if (this.inputMessage && this.inputMessage.trim() !== '') {
      const arrayMessage = {
        user: this.loggedInUserName,
        message: this.inputMessage.trim(),
        room: this.currentRoomName
      };
  
      console.log('Sending message:', arrayMessage);
  
      this.chatService.sendMessage(arrayMessage.message)
        .then(() => {
          console.log('Message sent successfully');
          this.inputMessage = '';
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    }
  }
  
  leaveChat() {
    this.chatService.leaveChat()
      .then(() => {
        this.router.navigate(['welcome']);
        setTimeout(() => {
          location.reload();
        }, 0);
      }).catch((err) => {
        console.log(err);
      })
  }
}