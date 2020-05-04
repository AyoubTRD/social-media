import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const config = functions.config();

admin.initializeApp(config.firebase);

import * as likes from "./likes";
import * as posts from "./posts";
import * as comments from "./comments";
import * as user from "./user";

export const documentCreationMiddleware = functions.firestore
  .document("{collectionId}/{docId}")
  .onCreate(async snapshot => {
    await snapshot.ref.set(
      {
        createdAt: snapshot.createTime
      },
      { merge: true }
    );
  });

export const likesCreateMiddleware = likes.likesCreateMiddleware;
export const likesDeleteMiddleware = likes.likesDeleteMiddleware;
export const postMiddleware = posts.postMiddleware;
export const postDeleteMiddleware = posts.postDeleteMiddleware;
export const commentCreateMiddleware = comments.commentCreateMiddleware;
export const commentUpdateMiddleware = comments.commentUpdateMiddleware;
export const commentDeleteMiddleware = comments.commentDeleteMiddleware;
export const userUpdateMiddleware = user.userUpdateMiddleware;
