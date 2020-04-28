import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().app);

export const postMiddleware = functions.firestore
  .document("posts/{postId}")
  .onCreate(async snapshot => {
    await admin
      .firestore()
      .collection("posts")
      .doc(snapshot.id)
      .set(
        {
          createdAt: snapshot.createTime
        },
        { merge: true }
      );
  });
