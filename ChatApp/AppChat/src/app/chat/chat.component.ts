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
  currentRoomName : string = '';
  isRoomNameChanged: boolean = false; 
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;


  ngOnInit(): void {
    const roomNameFromStorage = sessionStorage.getItem("room");
  if (roomNameFromStorage) {
    this.currentRoomName = roomNameFromStorage;  // Lấy tên phòng từ sessionStorage
  }

  this.chatService.messages$.subscribe(res => {
    console.log('Received messages:', res); // Log toàn bộ dữ liệu nhận được
    this.messages = res;    
    if (res.length > 0) {
      const newRoom = res[0]?.room || '';
      if (newRoom && newRoom !== this.currentRoomName) {
        this.currentRoomName = newRoom;
        this.isRoomNameChanged = true;
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
        message: this.inputMessage,   
        room : this.currentRoomName   
      };
      if (!this.isRoomNameChanged) {
        arrayMessage.room = this.currentRoomName;    
      }
      // Gọi đến sendMessage với user, message và room
      this.chatService.sendMessage(this.loggedInUserName as string, this.inputMessage.trim())
        .then(() => {
          console.log('Message sent successfully');
          this.inputMessage = ''; // Reset input message sau khi gửi
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    }
  }
  
  leaveChat() {
     // Xóa sessionStorage khi người dùng rời khỏi phòng chat
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("room");
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