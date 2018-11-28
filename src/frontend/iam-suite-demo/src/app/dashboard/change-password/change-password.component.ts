import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { UserService } from "src/app/shared/user.service";
import { ChangePasswordService } from "src/app/shared/change-password.service";
import { MatDialogRef } from "@angular/material";
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public otpVerified: boolean = false;
  constructor(
    private _fB: FormBuilder,
    private _userService: UserService,
    private _changePasswordService: ChangePasswordService,
    private _matDialogRef: MatDialogRef<ChangePasswordComponent>
  ) {}

  ngOnInit() {
    this.buildForm();
    this._userService.currentUserEmail.subscribe(value => {
      this.email.setValue(value);
      this.msisdn.setValue(this._userService.msisdn);
    });
  }

  buildForm() {
    this.changePasswordForm = this._fB.group({
      msisdn: "",
      email: "",
      old_password: "",
      new_password: "",
      otp: ""
    });
  }

  get msisdn(): FormControl {
    return this.changePasswordForm.get("msisdn") as FormControl;
  }
  get email(): FormControl {
    return this.changePasswordForm.get("email") as FormControl;
  }
  get old_password(): FormControl {
    return this.changePasswordForm.get("old_password") as FormControl;
  }
  get new_password(): FormControl {
    return this.changePasswordForm.get("new_password") as FormControl;
  }
  get otp(): FormControl {
    return this.changePasswordForm.get("otp") as FormControl;
  }

  changePassword() {
    this._changePasswordService
      .changePassword(this.changePasswordForm.value)
      .subscribe(
        data => {
          this.otpVerified = true;
        },
        error => console.log(error)
      );
  }

  initiatePasswordChange() {
    this._changePasswordService
      .initiateChangePassword(this.msisdn.value, this.email.value)
      .subscribe(
        data => console.log("Password Reset Initated, check email for OTP"),
        error => console.log(error)
      );
  }

  done() {
    this._matDialogRef.close();
  }
}
