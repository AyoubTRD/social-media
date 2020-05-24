<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].background}">
    <nuxt />
  </v-app>
</template>

<script>
export default {
  created() {
    this.$fireAuth.onAuthStateChanged(async user => {
      if (user) {
        await this.$store.dispatch("user/auth", {
          user: { ...user, photoURL: user.photoURL || "" },
          createIfNew: true
        });
        this.$store.commit("posts/setPosts", this.$store.state.posts.posts);
      } else {
        this.$store.dispatch("user/auth", { user: null });
      }
    });
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    }
  }
};
</script>