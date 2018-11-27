import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { OtpService } from "../../shared/otp.service";
import { Router } from "@angular/router";
export interface DialogData {
  email: string;
}
@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.css"]
})
export class OtpComponent implements OnInit {
  public otpForm: FormGroup;
  constructor(
    private _router: Router,
    private _otpService: OtpService,
    private _fB: FormBuilder,
    public _dialogRef: MatDialogRef<OtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.buildForm();
  }

  ngOnInit() {}
  buildForm() {
    this.otpForm = this._fB.group({
      otp: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", Validators.required]
    });
  }

  get otp(): FormControl {
    return this.otpForm.get("otp") as FormControl;
  }
  get email(): FormControl {
    return this.otpForm.get("email") as FormControl;
  }
  submit() {
    this.otp.setErrors(null);
    this.email.setValue(this.data.email);
    this._otpService.verify(this.otpForm.value).subscribe(
      data => {
        this._dialogRef.close();
        this._router.navigate(["dashboard"]);
      },
      error => {
        this.otp.setErrors({ failed: "OTP verification failed" });
      }
    );
  }
}
