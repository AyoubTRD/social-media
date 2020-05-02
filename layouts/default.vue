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
        <v-btn text nuxt to="/">Home</v-btn>
        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="accent" outlined>
              My account
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-img :src="user.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-title class="title">{{
                user.name || "Anonymous"
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item nuxt to="/profile">
              <v-list-item-title>Profile</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Sign out</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-logout-variant</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-menu>
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
    ...mapGetters("user", ["isLoggedIn", "user"])
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
