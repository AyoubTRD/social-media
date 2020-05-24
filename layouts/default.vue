<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].background}">
    <Navbar />
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
import Navbar from "../components/Navbar";

export default {
  components: { LoginModal, SignupModal, Navbar },
  computed: {
    ...mapGetters("user", ["isLoggedIn", "user"]),
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    }
  },
  methods: {
    ...mapMutations("user", ["setSignupModal", "setLoginModal"]),
    ...mapActions("user", ["logout"])
  },
  data() {
    return {
      drawer: false,
      expandAccount: false
    };
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
