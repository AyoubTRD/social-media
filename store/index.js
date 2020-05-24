import Cookies from "js-cookie";
const COOKIE_NAME = "__session";

import admin from "firebase-admin"

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://simple-demo-b69f7.firebaseio.com",
  storageBucket: "simple-demo-b69f7.appspot.com",
  authDomain: "simple-demo-b69f7.firebaseapp.com"
}, "ssr")


export const strict = false;
export const actions = {
  nuxtServerInit:
    process.server && !process.static
      ? async function({ commit }, { req, store }) {
          console.log("Server init")
          if (!req.headers.cookie) {
            console.log("No cookie in the headers")
            return;
          }


          if (!admin.apps.length) {
            console.log("No apps")
            return;
          }

          const cookie = await import("cookie");

          const parsedCookies = cookie.parse(req.headers.cookie);
          if (!parsedCookies) {
            console.log("No parsed cookies")
            return;
          }
          const idToken = parsedCookies[COOKIE_NAME];

          const JWTDecode = (await import("jwt-decode")).default;
          let decodedAuthUserClaims = null;
          try {
            decodedAuthUserClaims = JWTDecode(idToken);
          } catch(e) {
            console.log(e);
          }

          if (decodedAuthUserClaims == null) {
            console.log("No auth user claims")
            return;
          }

          try {
            const decodedToken = await app
              .auth()
              .verifyIdToken(idToken, true);
            const uid = decodedToken.uid;
            console.log(uid)
            if (uid) {
              const user = {
                ...decodedAuthUserClaims,
                photoURL: decodedAuthUserClaims.picture,
                displayName: decodedAuthUserClaims.name,
                email: decodedAuthUserClaims.email,
                uid: decodedAuthUserClaims.user_id
              };
              console.log(user)
              store.dispatch("user/auth", { user });
            }
          } catch(e) {
            console.log(e)
          }
        }
      : () => {},

  SET_SESSION_COOKIE(ctx, idToken) {
    const secure = process.env.NODE_ENV === "production";
    let expires = 0;
    if (idToken) {
      expires = 3600;
    }
    Cookies.set(COOKIE_NAME, idToken, {
      expires,
      secure
    });
  }
};
