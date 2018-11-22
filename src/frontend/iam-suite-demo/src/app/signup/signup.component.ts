import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignupService } from "../shared/signup.service";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
  public successfullSignup: boolean = false;
  constructor(private _fb: FormBuilder, private _snackBar: MatSnackBar, private _signupService: SignupService) {
    this.buildForm();
  }

  ngOnInit() {
    this.confirm_password.valueChanges.forEach(() => {
      this.confirm_password.setErrors(null);
    });
  }

  buildForm() {
    this.signupForm = this._fb.group({
      firstName: ["", Validators.required],
      middleName: ["", Validators.required],
      lastName: ["", Validators.required],
      address: ["", Validators.required],
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.minLength(6), Validators.required]],
      confirm_password: ["", [Validators.minLength(6), Validators.required]],
      msisdn: ["", Validators.required]
    });
  }

  get firstName(): FormControl {
    return this.signupForm.get("firstName") as FormControl;
  }

  get middleName(): FormControl {
    return this.signupForm.get("middleName") as FormControl;
  }

  get lastName(): FormControl {
    return this.signupForm.get("lastName") as FormControl;
  }

  get address(): FormControl {
    return this.signupForm.get("address") as FormControl;
  }
  get email(): FormControl {
    return this.signupForm.get("email") as FormControl;
  }
  get password(): FormControl {
    return this.signupForm.get("password") as FormControl;
  }
  get confirm_password(): FormControl {
    return this.signupForm.get("confirm_password") as FormControl;
  }
  get msisdn(): FormControl {
    return this.signupForm.get("msisdn") as FormControl;
  }

  signup() {
    if (this.password.value != this.confirm_password.value) {
      this.confirm_password.setErrors({ mismatch: true });
    } else {
      this._signupService.signup(this.signupForm.value).subscribe(()=>{
        this.successfullSignup = true;
      },(error)=>{
        this.confirm_password.setErrors(null);
        this._snackBar.open(error.error.error,'',{
          duration: 5000
        })
      })
    }
  }
}
