import { Component,Input,type OnInit } from '@angular/core';
import { FirebaseTSFirestore} from 'firebasets/firebasetsFirestore/FirebaseTSFirestore';
import { Router } from '@angular/router';
import { FirebaseTSAuth } from 'firebasets/FirebaseTSAuth/firebaseTSAuth';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  implements OnInit{

  @Input() show: boolean | undefined;

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;

  constructor() { 
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
  }

  onContinueClick(
    nameInput: HTMLInputElement,
    descriptionInput: HTMLTextAreaElement
  ) {
    let name = nameInput.value;
    let description = descriptionInput.value;
    this.firestore.create(
      {
        path: ["Users", this.auth.getAuth().currentUser?.uid as string],
        data: {
          PublicName: name,//PublicName changed
          description: description
        },
        onComplete: (docId) => {
          alert("Profile Created");
          nameInput.value = "";
          descriptionInput.value = "";
        },
        onFail: (err) => {

        }
      }
    );
  }

}