import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { ResetPasswordService } from "../shared/reset-password.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public otpVerified: boolean = false;
  constructor(
    private _fB: FormBuilder,
    private _resetPasswordService: ResetPasswordService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.resetPasswordForm = this._fB.group({
      email: "",
      msisdn: "",
      otp: "",
      new_password: ""
    });
  }

  get email(): FormControl {
    return this.resetPasswordForm.get("email") as FormControl;
  }
  get msisdn(): FormControl {
    return this.resetPasswordForm.get("msisdn") as FormControl;
  }
  get otp(): FormControl {
    return this.resetPasswordForm.get("otp") as FormControl;
  }
  get new_password(): FormControl {
    return this.resetPasswordForm.get("new_password") as FormControl;
  }

  initiateResetPassword() {
    this._resetPasswordService
      .initiatePasswordReset({
        email: this.email.value,
        msisdn: this.msisdn.value
      })
      .subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error)
      );
  }

  resetPassword() {
    this._resetPasswordService
      .resetPassword(this.resetPasswordForm.value)
      .subscribe(
        data => {
          this.otpVerified = true;
        },
        error => {
          console.log(error);
        }
      );
  }
}
