<template>
  <div class="post">
    <!--    <h2>{{ post.title }}</h2>-->
    <!--    <p>{{ post.content }}</p>-->
  </div>
</template>

<script>
export default {
  props: ["post"],
  created() {
    console.log(this.post);
  },
  name: "Post"
};
</script>

<style scoped></style>
