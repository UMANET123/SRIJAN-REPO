import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(private _http: HttpClient) {}

  login(credentials: any) {
    let email = credentials.email;
    let password = credentials.password;
    let hash = "Basic " + btoa(`${email}:${password}`);
    return this._http.post(
      "https://globeslingshot-dev-labs.apigee.net/identity/v1/login",
      {},
      {
        headers: {
          Authorization: hash
        }
      }
    );
  }
}
