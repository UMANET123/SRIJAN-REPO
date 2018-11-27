import { Injectable } from "@angular/core";
import {
  Observable,
  Observer,
  Subscriber,
  Subject,
  BehaviorSubject
} from "rxjs";
@Injectable({
  providedIn: "root"
})
export class UserService {
  public currentUserEmail: BehaviorSubject<string> = new BehaviorSubject("");
  public twoFactorState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() {}

  setCurrentUserEmail(email: string) {
    this.currentUserEmail.next(email);
  }

  setTwoFactorState(state: boolean) {}
}
