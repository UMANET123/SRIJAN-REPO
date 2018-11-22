import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class SignupService {
  constructor(private _http: HttpClient) {}

  signup(data: any) {
    let payload = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      address: data.address,
      msisdn: `639${data.msisdn}`,
      email: data.email,
      password: data.password
    };

    return this._http.post(
      "https://globeslingshot-dev-labs.apigee.net/identity/v1/register",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
