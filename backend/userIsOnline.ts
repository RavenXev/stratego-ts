import { auth, database } from "./config";
import { onAuthStateChanged } from "firebase/auth";
import { signInAnonymously } from "firebase/auth";
import {
  onDisconnect,
  ref,
  set,
  onValue,
  onChildAdded,
} from "firebase/database";

function userIsOnline() {
  let userId: string;
  let userRef;
  let gameRef;

  const allGamesRef = ref(database, "games");
  const allUsersRef = ref(database, "users");

  const createGameButton = document.querySelector("#createGameButton");

  function createGame(userId: string) {
    gameRef = ref(database, "games/" + userId);
    set(gameRef, {
      host: userId,
      opponent: "Ada lovelace",
    });
  }
  if (createGameButton !== null) {
    createGameButton.addEventListener("click", () => {
      createGame(userId);
    });
  }

  function initGame() {
    //fires when a player changes
    onValue(allUsersRef, (snapshot) => {
      const data = snapshot.val();
    });

    onChildAdded(allGamesRef, (snapshot) => {
      const addedGame = snapshot.val();
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //logged in
      userId = user.uid;
      userRef = ref(database, "users/" + userId);
      set(userRef, {
        id: userId,
        name: "hello",
      });

      gameRef = ref(database, "games/" + userId);
      //remove me from firebase when I disconnect
      onDisconnect(userRef).remove();

      onDisconnect(gameRef).remove();

      //begin game
      initGame();
    } else {
      //user is signed out
    }
  });

  signInAnonymously(auth).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
}

export default userIsOnline;
