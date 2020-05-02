import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const likesCreateMiddleware = functions.firestore
  .document("likes/{likeId}")
  .onCreate(async snapshot => {
    await admin
      .firestore()
      .collection("posts")
      .doc(snapshot.data().postId)
      .set(
        {
          likes: admin.firestore.FieldValue.increment(1)
        },
        { merge: true }
      );
  });

export const likesDeleteMiddleware = functions.firestore
  .document("likes/{likeId}")
  .onDelete(async snapshot => {
    const post = await admin
      .firestore()
      .collection("posts")
      .doc(snapshot.data().postId)
      .get();
    if (!post.exists) return;
    console.log("post exists", post.exists);
    await post.ref.set(
      {
        likes: admin.firestore.FieldValue.increment(-1)
      },
      { merge: true }
    );
  });
