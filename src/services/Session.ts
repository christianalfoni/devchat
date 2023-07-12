import { Disposable, inject, injectable } from "../impact-app-test";
import { Signal, signal } from "signalit";
import { Firebase } from "../global-services/Firebase";
import type { User } from "firebase/auth";

@injectable()
export class Session extends Disposable {
  private _user: Signal<User>;
  get user() {
    return this._user.value;
  }
  constructor(@inject("user") user: User, private _firebase: Firebase) {
    super();
    this._user = signal(user);
  }
  signOut() {}
}
