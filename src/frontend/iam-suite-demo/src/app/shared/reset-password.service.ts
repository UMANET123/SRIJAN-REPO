import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class ResetPasswordService {
  constructor(private _http: HttpClient) {}

  initiatePasswordReset(payload: any) {
    return this._http.post(
      "https://globeslingshot-dev-labs.apigee.net/identity/v1/initiate_reset_password",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        },
        observe: "response"
      }
    );
  }

  resetPassword(payload: any) {
    return this._http.put(
      "https://globeslingshot-dev-labs.apigee.net/identity/v1/reset_password",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        },
        observe: "response"
      }
    );
  }
}
