import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { HttpClientModule } from "@angular/common/http";
import { UserService } from "../shared/user.service";
import {
  MatButtonModule,
  MatDialogModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";
import { TwoFactorAuthComponent } from "./two-factor-auth/two-factor-auth.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TwoFactorService } from "../shared/two-factor.service";
const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent
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
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    DashboardComponent,
    TwoFactorAuthComponent,
    ChangePasswordComponent
  ],
  providers: [UserService, TwoFactorService],
  entryComponents: [TwoFactorAuthComponent, ChangePasswordComponent],
  exports: [RouterModule]
})
export class DashboardModule {}
