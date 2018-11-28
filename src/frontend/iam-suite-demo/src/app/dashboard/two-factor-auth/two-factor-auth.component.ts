import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/shared/user.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { combineLatest } from "rxjs";
import { TwoFactorService } from "src/app/shared/two-factor.service";
import { OtpService } from "src/app/shared/otp.service";
import { MatDialog, MatDialogRef } from "@angular/material";
@Component({
  selector: "app-two-factor-auth",
  templateUrl: "./two-factor-auth.component.html",
  styleUrls: ["./two-factor-auth.component.css"]
})
export class TwoFactorAuthComponent implements OnInit {
  public userEmail: string;
  public twoFactorState: boolean;
  public twoFactorForm: FormGroup;
  public authForm: FormGroup;
  public otpVerified: boolean = false;
  constructor(
    private _userService: UserService,
    private _fB: FormBuilder,
    private _twoFactorService: TwoFactorService,
    private _otpService: OtpService,
    private _dialogRef: MatDialogRef<TwoFactorAuthComponent>
  ) {}

  ngOnInit() {
    this.buildForm();
    combineLatest(
      this._userService.currentUserEmail,
      this._userService.twoFactorState
    ).subscribe(x => {
      console.log(x);
      this.userEmail = x[0];
      this.twoFactorState = x[1];
      this.email.setValue(this.userEmail);
      this.emailAddress.setValue(this.userEmail);
    });
  }

  buildForm() {
    this.twoFactorForm = this._fB.group({
      otp: ["", Validators.required],
      email: ""
    });

    this.authForm = this._fB.group({
      password: ["", Validators.required],
      emailAddress: [""]
    });
  }

  get otp(): FormControl {
    return this.twoFactorForm.get("otp") as FormControl;
  }
  get email(): FormControl {
    return this.twoFactorForm.get("email") as FormControl;
  }

  get password(): FormControl {
    return this.authForm.get("password") as FormControl;
  }
  get emailAddress(): FormControl {
    return this.authForm.get("emailAddress") as FormControl;
  }

  toggleOtp() {
    this._twoFactorService
      .toggleTwoFactor(this.authForm.value, !this.twoFactorState)
      .subscribe(data => console.log(data), error => console.log(error));
  }

  verifyOtp() {
    this._otpService.verify(this.twoFactorForm.value).subscribe(
      data => {
        this.otpVerified = true;
        this._userService.setTwoFactorState(!this.twoFactorState);
      },
      error => console.log(error)
    );
  }

  done() {
    this._dialogRef.close();
  }
}
