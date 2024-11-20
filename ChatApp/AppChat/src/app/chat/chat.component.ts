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

  sendMessage() {
    if (this.inputMessage && this.inputMessage.trim() != '') {
      const arrayMessage = {
        user: this.loggedInUserName,
        message: this.inputMessage,   
        room : this.currentRoomName   
      };
      if (!this.isRoomNameChanged) {
        arrayMessage.room = this.currentRoomName;    
      }
      const messageContent = arrayMessage.message;
      this.chatService.sendMessage(messageContent)
      .then(()=>{
        this.inputMessage = '';
      }).catch((error) => {
        console.log(error);
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