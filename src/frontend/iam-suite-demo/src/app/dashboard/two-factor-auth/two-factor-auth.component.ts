import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/shared/user.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { combineLatest } from "rxjs";
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
  constructor(private _userService: UserService, private _fB: FormBuilder) {}

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

      console.log(this.userEmail);
      console.log(this.twoFactorForm.value);
    });
  }

  setEmail() {
    this._userService.setCurrentUserEmail("valindo@wafer.ee");
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

  verifyOtp() {}
}
