import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class UserService {
  public currentUserEmail: BehaviorSubject<string> = new BehaviorSubject(
    "valindo.godinho@srijan.net"
  );
  public twoFactorState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public msisdn: string = "639123456789";
  constructor() {}

  setCurrentUserEmail(email: string) {
    this.currentUserEmail.next(email);
  }

  setTwoFactorState(state: boolean) {
    this.twoFactorState.next(state);
  }
}
