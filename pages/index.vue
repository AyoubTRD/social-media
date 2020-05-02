<template>
  <div>
    <div class="posts">
      <CreatePost v-if="isLoggedIn" />
      <no-ssr>
        <masonry :cols="{ default: 2, 650: 1 }" :gutter="15">
          <Post
            v-for="post in posts"
            :key="post.id"
            :post="post"
            :comments="post.recentComments"
            :showLink="true"
            class="mb-4"
          />
        </masonry>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Post from "@/components/Post";

import NoSSR from "vue-no-ssr";
import CreatePost from "../components/CreatePost";

export default {
  components: { CreatePost, Post, "no-ssr": NoSSR },
  async asyncData({ app, store }) {
    const posts = await app.$fireStore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();
    const postsData = posts.docs.map(post => ({ ...post.data(), id: post.id }));
    store.commit("posts/setPosts", postsData);
  },
  computed: {
    ...mapGetters("posts", ["posts"]),
    ...mapGetters("user", ["user", "isLoggedIn"])
  },
  async created() {
    let postIsFirstSnapshot = true;
    this.$fireStore.collection("posts").onSnapshot(snapshot => {
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
  }
};
</script>
