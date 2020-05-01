import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const userUpdateMiddleware = functions.firestore
  .document("users/{userId}")
  .onUpdate(async change => {
    const toBeUpdated = ["posts", "comments"];
    const updatePromises = toBeUpdated.map(async update => {
      const snapshots = await admin
        .firestore()
        .collection(update)
        .where("uid", "==", change.after.id)
        .get();
      const snapshotUpdatePromises = snapshots.docs.map(doc =>
        doc.ref.set(
          {
            user: { ...change.after.data(), id: change.after.id }
          },
          { merge: true }
        )
      );
      return Promise.all(snapshotUpdatePromises);
    });
    await Promise.all(updatePromises);
  });
