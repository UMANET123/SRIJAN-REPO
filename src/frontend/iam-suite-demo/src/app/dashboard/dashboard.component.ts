import { Component, OnInit } from "@angular/core";
import { UserService } from "../shared/user.service";
import { TwoFactorAuthComponent } from "./two-factor-auth/two-factor-auth.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { MatDialog } from "@angular/material";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  public otpActive: boolean;
  public email: string;
  constructor(
    private _userService: UserService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit() {
    this._userService.twoFactorState.subscribe(
      value => (this.otpActive = value)
    );

    this._userService.currentUserEmail.subscribe(email => (this.email = email));
  }

  toggleTwoFa() {
    this._matDialog.open(TwoFactorAuthComponent);
  }

  changePassword() {
    this._matDialog.open(ChangePasswordComponent);
  }
}
