<template>
  <div>
    <ProfileBar />
    <no-ssr>
      <masonry v-if="posts.length" class="mt-5" :cols="{ default: 2, 650: 1 }" :gutter="15">
        <Post
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :comments="post.recentComments"
          :showLink="true"
          class="mb-4"
        />
      </masonry>
      <h2 v-else class="primary--text mt-5" style="text-align: center">This user has no posts</h2>
    </no-ssr>
  </div>
</template>

<script>
import ProfileBar from "@/components/ProfileBar";
import Post from "@/components/Post";
import { mapGetters } from "vuex";
import NoSSR from "vue-no-ssr";

export default {
  components: { ProfileBar, Post, "no-ssr": NoSSR },
  computed: {
    ...mapGetters("user", ["profile"]),
    ...mapGetters("posts", ["posts"])
  },
  async asyncData({ app, params, store, error }) {
    const user = await app.$fireStore
      .collection("users")
      .doc(params.id)
      .get();
    if (!user.exists) {
      error({
        message: "This user is not found",
        statusCode: 404
      });
      return;
    }
    store.commit("user/setProfile", { ...user.data(), id: user.id });
    const posts = await app.$fireStore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .where("uid", "==", user.id)
      .limit(20)
      .get();
    const postsData = posts.docs.map(post => ({ ...post.data(), id: post.id }));
    store.commit("posts/setPosts", postsData);
  },
  async created() {
    let postIsFirstSnapshot = true;
    this.unsubscribe = this.$fireStore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .where("uid", "==", this.profile.id)
      .onSnapshot(snapshot => {
        if (!postIsFirstSnapshot) {
          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              this.$store.commit("posts/addPost", {
                ...change.doc.data(),
                id: change.doc.id
              });
            }
            if (change.type === "modified") {
              this.$store.commit("posts/updatePost", {
                ...change.doc.data(),
                id: change.doc.id
              });
            }
            if (change.type === "removed") {
              this.$store.commit("posts/removePost", change.doc.id);
            }
          });
        } else {
          postIsFirstSnapshot = false;
        }
      });
  },
  destroyed() {
    this.unsubscribe();
  }
};
</script>

<style scoped></style>
