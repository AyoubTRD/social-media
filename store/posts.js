export const state = () => ({
  posts: []
});

export const getters = {
  posts(state) {
    return state.posts;
  },
  post(state) {
    return state.posts[0];
  }
};

export const mutations = {
  async setPosts(state, posts) {
    if (this.state.user.user) {
      const likedPosts = await this.$fireStore
        .collection("likes")
        .where("uid", "==", this.state.user.user.id)
        .get();
      const likedIds = likedPosts.docs.map(doc => doc.data().postId);
      console.log(likedIds);
      state.posts = posts.map(post => ({
        ...post,
        isLiked: likedIds.includes(post.id)
      }));
      return;
    }
    state.posts = posts.map(post => ({ ...post, isLiked: false }));
  },
  async addPost(state, post) {
    if (this.state.user.user) {
      const like = await this.$fireStore
        .collection("likes")
        .where("uid", "==", this.state.user.user.id)
        .where("postId", "==", post.id)
        .get();
      post.isLiked = !!like.docs.length;
    }
    state.posts.unshift(post);
  },
  removePost(state, id) {
    state.posts = state.posts.filter(post => post.id !== id);
  },
  async updatePost(state, post, checkLike = true) {
    if (this.state.user.user && checkLike) {
      const like = await this.$fireStore
        .collection("likes")
        .where("uid", "==", this.state.user.user.id)
        .where("postId", "==", post.id)
        .get();
      post.isLiked = !!like.docs.length;
    }
    state.posts = state.posts.map(oldPost =>
      oldPost.id === post.id ? post : oldPost
    );
  }
};

export const actions = {
  async likePost({ commit }, post) {
    if (post.isLiked) {
      commit(
        "updatePost",
        { ...post, likes: post.likes - 1, isLiked: false },
        false
      );
      const like = await this.$fireStore
        .collection("likes")
        .where("uid", "==", this.state.user.user.id)
        .where("postId", "==", post.id)
        .get();
      await Promise.all(like.docs.map(doc => doc.ref.delete()));
    } else {
      commit(
        "updatePost",
        { ...post, likes: post.likes + 1, isLiked: true },
        false
      );
      await this.$fireStore
        .collection("likes")
        .doc(`${this.state.user.user.id}_${post.id}`)
        .set({
          uid: this.state.user.user.id,
          postId: post.id
        });
    }
  },
  async sendComment({ commit }, { comment = {}, post = {} } = {}) {
    const commentRef = await this.$fireStore.collection("comments").add({
      content: comment.content,
      uid: this.state.user.user.id,
      postId: post.id,
      user: this.state.user.user
    });
    commit("updatePost", {
      ...post,
      recentComments: [
        {
          content: comment.content,
          user: this.state.user.user,
          id: commentRef.id
        },
        ...(post.recentComments || [])
      ]
    });
  },
  async deleteComment({ commit }, { comment = {}, post = {} } = {}) {
    console.log(comment);
    await this.$fireStore
      .collection("comments")
      .doc(comment.id)
      .delete();
    post.recentComments = post.recentComments.filter(
      cmnt => cmnt.id !== comment.id
    );
    commit("updatePost", post);
  },
  async editComment({ commit }, { comment = {}, post = {} } = {}) {
    console.log(comment, post);
    post.recentComments = post.recentComments.map(cmnt =>
      cmnt.id === comment.id ? comment : cmnt
    );
    commit("updatePost", post);
    await this.$fireStore
      .collection("comments")
      .doc(comment.id)
      .set(comment, { merge: true });
  }
};
