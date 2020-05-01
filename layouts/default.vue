<template>
  <v-app>
    <v-app-bar app color="grey--lighten-2">
      <nuxt-link to="/" class="text-style-none home-link">
        <v-toolbar-title>
          <v-img src="/logo.svg" class="logo"></v-img>
          Together
        </v-toolbar-title>
      </nuxt-link>
      <v-spacer />
      <div v-if="!isLoggedIn">
        <v-btn @click="setSignupModal(true)" color="primary">
          <span>Create account</span>
        </v-btn>
        <v-btn text @click="setLoginModal(true)" color="primary">
          <span>Sign in</span>
        </v-btn>
      </div>
      <div v-else>
        <v-btn @click="logout" :loading="$store.state.user.signoutLoading">
          <v-icon left>mdi-logout</v-icon>
          <span>Sign out</span>
        </v-btn>
      </div>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <SignupModal />
    <LoginModal />
  </v-app>
</template>
<script>
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
import SignupModal from "../components/SignupModal";
import LoginModal from "../components/LoginModal";
export default {
  components: { LoginModal, SignupModal },
  computed: {
    ...mapGetters("user", ["isLoggedIn"])
  },
  methods: {
    ...mapMutations("user", ["setSignupModal", "setLoginModal", "logout"]),
    ...mapActions("user", ["logout"])
  },
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
  }
};
</script>

<style>
.home-link {
  text-decoration: none;
  color: inherit !important;
}
.logo {
  display: inline-block;
  width: 20px;
  margin-right: 6px;
}
</style>
