<template>
  <Post :post="post" :comments="comments" />
</template>

<script>
import Post from "../../components/Post";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "SinglePost",
  components: { Post },
  async asyncData({ error, store, app, params: { id } }) {
    const post = await app.$fireStore
      .collection("posts")
      .doc(id)
      .get();
    if (!post.exists) {
      return error({
        code: 404,
        message: "Post not found"
      });
    }
    await store.commit("posts/addPost", { ...post.data(), id: post.id });
  },
  methods: {
    ...mapMutations("posts", [
      "addComment",
      "updateComment",
      "removeComment",
      "updatePost"
    ])
  },
  computed: {
    ...mapGetters("posts", ["post", "comments"])
  },
  created() {
    this.$store.state.posts.comments = [];
    this.$fireStore
      .collection("posts")
      .doc(this.post.id)
      .onSnapshot(snapshot => {
        if (!snapshot.exists) {
          return this.$router.push("/");
        }
        this.updatePost({ ...snapshot.data(), id: snapshot.id });
      });
    this.$fireStore
      .collection("comments")
      .where("postId", "==", this.post.id)
      .orderBy("createdAt")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          console.log(change);
          if (change.type === "added") {
            this.addComment({
              ...change.doc.data(),
              id: change.doc.id
            });
          }
          if (change.type === "removed") {
            this.$store;
            this.removeComment({
              ...change.doc.data(),
              id: change.doc.id
            });
          }
          if (change.type === "modified") {
            this.updateComment({
              ...change.doc.data(),
              id: change.doc.id
            });
          }
        });
      });
  }
};
</script>

<style scoped></style>
