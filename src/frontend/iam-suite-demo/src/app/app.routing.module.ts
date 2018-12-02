import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";

const routes: Routes = [
  // {
  //   path: "login",
  //   loadChildren: "./login/login.module#LoginModule"
  // },
  {
    path: "signup",
    loadChildren: "./signup/signup.module#SignupModule"
  },
  {
    path: "reset",
    loadChildren: "./reset-password/reset-password.module#ResetPasswordModule"
  },
  // {
  //   path: "dashboard",
  //   loadChildren: "./dashboard/dashboard.module#DashboardModule"
  // },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "login"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
