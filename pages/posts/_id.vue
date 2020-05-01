<template>
  <h1>Post</h1>
</template>

<script>
export default {
  name: "SinglePost",
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
  }
};
</script>

<style scoped></style>
