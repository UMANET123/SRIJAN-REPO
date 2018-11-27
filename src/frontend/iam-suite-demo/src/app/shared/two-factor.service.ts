import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class TwoFactorService {
  constructor(private _http: HttpClient) {}

  toggleTwoFactor(email: string, state: boolean) {
    this._http.post(
      "https://globeslingshot-dev-labs.apigee.net/identity/v1/toggle_otp",
      {
        toggle_otp: state,
        transport: "email",
        email: email
      }
    );
  }
}
