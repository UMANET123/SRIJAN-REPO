import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class ChangePasswordService {
  constructor(private _http: HttpClient) {}

  initiateChangePassword(msisdn: string, email: string) {
    return this._http.post(
      "https://globeslingshot-dev-labs.apigee.net/identity/v1/initiate_reset_password",
      {
        msisdn: msisdn,
        email: email
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        observe: "response"
      }
    );
  }

  changePassword(data) {
    return this._http.put(
      "https://globeslingshot-dev-labs.apigee.net/identity/v1/reset_password",
      data,
      {
        headers: {
          "Content-Type": "application/json"
        },
        observe: "response"
      }
    );
  }
}
