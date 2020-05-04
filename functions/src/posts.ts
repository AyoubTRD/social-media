import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const postMiddleware = functions.firestore
  .document("posts/{postId}")
  .onCreate(async snapshot => {
    const user = await admin
      .firestore()
      .collection("users")
      .doc(snapshot.data().uid)
      .get();
    await admin
      .firestore()
      .collection("posts")
      .doc(snapshot.id)
      .set(
        {
          user: user.data()
        },
        { merge: true }
      );
  });

export const postDeleteMiddleware = functions.firestore
  .document("posts/{postId}")
  .onDelete(async snapshot => {
    const comments = await admin
      .firestore()
      .collection("comments")
      .where("postId", "==", snapshot.id)
      .get();
    const likes = await admin
      .firestore()
      .collection("likes")
      .where("postId", "==", snapshot.id)
      .get();
    const commentDeletePromises = comments.docs.map(doc => doc.ref.delete());
    const likeDeletePromises = likes.docs.map(doc => doc.ref.delete());
    await Promise.all(commentDeletePromises);
    await Promise.all(likeDeletePromises);
    if (!snapshot.data().mediaPaths) return;
    await Promise.all(
      snapshot.data().mediaPaths.map(path =>
        admin
          .storage()
          .bucket()
          .file(path)
          .delete()
      )
    );
  });
