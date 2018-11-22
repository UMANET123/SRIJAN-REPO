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
    private _router: Router
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
    this._loginService.login(this.loginForm.value).subscribe(
      data => {
        this._router.navigate(["/dashboard"]);
      },
      err => {
        this._snackBar.open(err.error.error, "", {
          duration: 3000
        });
        this.email.setValue("");
        this.password.setValue("");
      }
    );
  }
}

@Component({
  selector: "snack-bar-component-login",
  templateUrl: "snack-bar-component-login.html",
  styles: [
    `
      .example-pizza-party {
        color: hotpink;
      }
    `
  ]
})
export class SnackBarLoginComponent {}
