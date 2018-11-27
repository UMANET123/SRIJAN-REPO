import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class OtpService {
  constructor(private _http: HttpClient) {}

  verify(data) {
    return this._http.post(
      "https://globeslingshot-dev-labs.apigee.net/identity/v1/verify_otp",
      data,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
