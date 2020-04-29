<template>
  <div>
    <!--    <Post b-for="post in posts" :post="post" />-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Post from "@/components/Post";
export default {
  components: { Post },
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
    ...mapGetters("posts", ["posts"])
  },
  created() {
    console.log(this.posts);
  }
};
</script>
