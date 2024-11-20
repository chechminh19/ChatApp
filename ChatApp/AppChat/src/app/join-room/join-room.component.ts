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
    
    joinRoomForm!: FormGroup;
    fb = inject(FormBuilder);
    router = inject(Router);
    chatService = inject(ChatService);
    ngOnInit(): void {
      this.joinRoomForm = this.fb.group({
        user: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        room: ['', Validators.required]
      })
    }
    get user() {
      return this.joinRoomForm.get('user');
    }

    joinRoom(){
      
      const {user, room} = this.joinRoomForm.value;
      sessionStorage.setItem("user", user);
      this.chatService.joinRoom(user, room).then(()=>{
        this.router.navigate(['chat']);
      }).catch((error)=>{
        console.error;
      })      
    }
}
    
