import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { LoginService } from "../shared/login.service";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OtpComponent } from "./otp/otp.component";
import { MatDialogModule } from "@angular/material/dialog";
import { UserService } from "../shared/user.service";
const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  declarations: [LoginComponent, OtpComponent],
  providers: [LoginService, UserService],
  entryComponents: [OtpComponent]
})
export class LoginModule {}
