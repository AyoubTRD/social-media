import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

async function refreshPostComments(comment: DocumentSnapshot) {
  const post = await admin
    .firestore()
    .collection("posts")
    .doc(comment.data().postId)
    .get();
  const comments = await admin
    .firestore()
    .collection("comments")
    .orderBy("createdAt", "desc")
    .where("postId", "==", post.id)
    .limit(20)
    .get();
  const commentsData = comments.docs.map(comment => ({
    ...comment.data(),
    id: comment.id
  }));
  await post.ref.set(
    {
      recentComments: commentsData
    },
    { merge: true }
  );
}

export const commentCreateMiddleware = functions.firestore
  .document("comments/{commentId}")
  .onCreate(async snapshot => {
    const user = await admin
      .firestore()
      .collection("users")
      .doc(snapshot.data().uid)
      .get();
    await snapshot.ref.set(
      {
        user: user.data()
      },
      { merge: true }
    );
    const post = admin
      .firestore()
      .collection("posts")
      .doc(snapshot.data().postId);
    await post.set(
      {
        comments: admin.firestore.FieldValue.increment(1)
      },
      { merge: true }
    );
    await refreshPostComments(snapshot);
  });

export const commentDeleteMiddleware = functions.firestore
  .document("comments/{commentId}")
  .onDelete(async snapshot => {
    const post = await admin
      .firestore()
      .collection("posts")
      .doc(snapshot.data().postId)
      .get();
    if (!post.exists) return;
    await post.ref.set(
      {
        comments: admin.firestore.FieldValue.increment(-1)
      },
      { merge: true }
    );
    await refreshPostComments(snapshot);
  });

export const commentUpdateMiddleware = functions.firestore
  .document("comments/{commentId}")
  .onUpdate(async change => {
    await refreshPostComments(change.after);
  });
