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
  fileUrl: string = '';
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;


  ngOnInit(): void {
    this.chatService.messages$.subscribe(res => {
      this.messages = res;
      this.currentRoomName = this.messages[0]?.room || '';
      this.isRoomNameChanged = this.currentRoomName !== undefined;
      console.log(this.messages)
    });
  }  
  
  ngAfterViewChecked(): void {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  // sendMessage() {
  //   if (this.inputMessage && this.inputMessage.trim() != '') {
  //     const arrayMessage = {
  //       user: this.loggedInUserName,
  //       message: this.inputMessage,   
  //       room : this.currentRoomName   
  //     };
  //     if (!this.isRoomNameChanged) {
  //       arrayMessage.room = this.currentRoomName;    
  //     }
  //     const messageContent = arrayMessage.message;
  //     this.chatService.sendMessage(messageContent)
  //     .then(()=>{
  //       this.inputMessage = '';
  //     }).catch((error) => {
  //       console.log(error);
  //     }); 
  //   }
  // }

  sendMessage() {
    if (this.inputMessage && this.inputMessage.trim() !== '') {  // Kiểm tra nếu tin nhắn không trống
      const arrayMessage = {
        user: this.loggedInUserName,  // Lấy tên người gửi từ session
        message: this.inputMessage.trim(),  // Lấy nội dung tin nhắn, loại bỏ khoảng trắng thừa
        room: this.currentRoomName   // Phòng mà người gửi tham gia
      };
  
      // Kiểm tra nếu phòng chưa thay đổi thì không cập nhật lại
      if (!this.isRoomNameChanged) {
        arrayMessage.room = this.currentRoomName;    
      }
  
      // Log tin nhắn trước khi gửi
      console.log('Sending message:', arrayMessage);
  
      // Gửi tin nhắn qua service
      this.chatService.sendMessage(arrayMessage.message)
        .then(() => {
          console.log('Message sent successfully');
          this.inputMessage = '';  // Reset input message sau khi gửi
        })
        .catch((error) => {
          console.error('Error while sending message:', error);
        });
    } else {
      console.log('Input message is empty');
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