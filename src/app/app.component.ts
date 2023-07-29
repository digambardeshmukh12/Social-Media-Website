import { Component } from '@angular/core';
import { MatBottomSheet } from '@Angular/material/bottom-sheet';

import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/FirebaseTSAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/FirebaseTSFirestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CodeibleSocialMediaProject';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  private static userDocument: UserDocument;

  constructor(private loginSheet: MatBottomSheet,
      private router: Router
    ){
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {

              this.router.navigate(["postfeed"]);//new 
            },
            whenSignedOut: user => {
              AppComponent.userDocument = null as any;
              this.router.navigate(["**"]);// new
            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVarification"]);
            },
            whenSignedInAndEmailVerified: user => {
              this.getUserProfile();
            },
            whenChanged: user => {

            }
          }
        );
      }
    );
  }
  public static getUserDocument(){
    return AppComponent.userDocument;
  }
  getUsername(){
    try {
      return AppComponent.userDocument.PublicName;
    } catch (err) {
      
    }
  }
  getUserProfile(){
    return new Promise<number>(
      (resolved, rejected) => {
        this.firestore.listenToDocument(
          {
            name: "Getting Document",
            path: ["Users", this.auth.getAuth().currentUser?.uid as string],
            onUpdate: (result) => {
              AppComponent.userDocument = <UserDocument>result.data();
              this.userHasProfile = result.exists; 
              AppComponent.userDocument.userId = this.auth.getAuth().currentUser?.uid as string;
              if(this.userHasProfile) {
                this.router.navigate(["postfeed"]);
                resolved(1);
              } else {
                resolved(0);
              }
            }
          }
        );
      }
    );
  }

  add(number1: any, number2: any) {
    return number1 + number2;
  }
  onLogoutClick(){
    this.auth.signOut();
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
}

export interface UserDocument {
  PublicName: string;
  description: string;
  userId: string;
}