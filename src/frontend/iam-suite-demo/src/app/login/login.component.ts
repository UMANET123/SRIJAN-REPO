import { Component, OnInit } from "@angular/core";
import { LoginService } from "../shared/login.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { OtpComponent } from "./otp/otp.component";
import { MatDialog } from "@angular/material";
import { OtpService } from "../shared/otp.service";
import { UserService } from "../shared/user.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  constructor(
    private _loginService: LoginService,
    private _fb: FormBuilder,
    public _snackBar: MatSnackBar,
    private _router: Router,
    private _matDialog: MatDialog,
    private _userService: UserService
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  buildForm() {
    this.loginForm = this._fb.group({
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.minLength(6), Validators.required]]
    });
  }

  get email(): FormControl {
    return this.loginForm.get("email") as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get("password") as FormControl;
  }

  disableButton() {
    return (
      this.email.hasError("email") ||
      this.email.hasError("required") ||
      (this.password.hasError("minlength") ||
        this.password.hasError("required"))
    );
  }

  login() {
    let payload: any = this.loginForm.value;
    this._loginService.login(payload).subscribe(
      data => {
        this._userService.setCurrentUserEmail(payload.email);
        if (data.status == 200) {
          this._userService.setTwoFactorState(false);
          this._router.navigate(["/dashboard"]);
        } else if (data.status == 201) {
          this._userService.setTwoFactorState(true);
          this._matDialog.open(OtpComponent, {
            data: { email: this.email.value }
          });
        }
      },
      err => {
        console.log(err);
        this._snackBar.open(err.error.error, "", {
          duration: 3000
        });
        this.email.setValue("");
        this.password.setValue("");
      }
    );
  }
}
