import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const likesCreateMiddleware = functions.firestore.document("likes/{likeId}").onCreate(async snapshot => {
  await admin.firestore().collection("posts").doc(snapshot.data().postId).set({
    likes: admin.firestore.FieldValue.increment(1)
  }, { merge: true })
})

export const likesDeleteMiddleware = functions.firestore.document("likes/{likeId}").onDelete(async snapshot => {
  await admin.firestore().collection("posts").doc(snapshot.data().postId).set({
    likes: admin.firestore.FieldValue.increment(-1)
  }, { merge: true })
})
