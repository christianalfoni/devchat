import { initializeApp } from "firebase/app";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { injectable } from "tsyringe";
import { Disposable, Emitter } from "../impact-app-test";

const firebaseConfig = {
  apiKey: "AIzaSyD6eJVamjqTVEchEzRKiJ-owsgUtAkcTWs",
  authDomain: "devchat-8559b.firebaseapp.com",
  projectId: "devchat-8559b",
  storageBucket: "devchat-8559b.appspot.com",
  messagingSenderId: "57326968408",
  appId: "1:57326968408:web:30b9deded3cdcb564df42d",
  measurementId: "G-RJCPL4ZQN1",
};

@injectable()
export class Firebase extends Disposable {
  private app = initializeApp(firebaseConfig);
  private auth = getAuth(this.app);
  private analytics = getAnalytics(this.app);

  private onAuthChangedEmitter = new Emitter<User | null>();
  onAuthChanged = this.onAuthChangedEmitter.event;

  constructor() {
    super();
    this.addDisposable(this.onAuthChangedEmitter);

    this.onDispose(
      onAuthStateChanged(
        this.auth,
        this.onAuthChangedEmitter.fire.bind(this.onAuthChangedEmitter)
      )
    );

    this.onDispose(() => {
      console.log("DISPOSE FIREBASE!");
    });
  }

  getUser() {
    return this.auth.currentUser;
  }
}
