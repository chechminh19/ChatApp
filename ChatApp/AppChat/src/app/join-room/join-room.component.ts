import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup,Validators,   } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {
    
  roomname: string = ''; // Biến lưu trữ tên phòng
  rooms: string[] = [];  // Danh sách các phòng đã tồn tại
    joinRoomForm!: FormGroup;
    fb = inject(FormBuilder);
    router = inject(Router);
    chatService = inject(ChatService);
    ngOnInit(): void {
      this.joinRoomForm = this.fb.group({
        user: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
        room: ['', Validators.required]
      })
    }
    get user() {
      return this.joinRoomForm.get('user');
    }
   
    
    joinRoom(){ 
      const { user, room } = this.joinRoomForm.value;
    sessionStorage.setItem("user", user);
    sessionStorage.setItem("room", room);
    console.log('Joining room with:', { user, room }); // Thêm log

     this.chatService.joinRoom(user, room)
    .then(() => {
      this.router.navigate(['chat']);
    })
    .catch((error) => {
      console.error('Join room failed:', error);
    });
    }
}
    
