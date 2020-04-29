<template>
  <v-app>
    <v-app-bar app color="grey--lighten-2">
      <v-toolbar-title color="primary">
        Real Events
      </v-toolbar-title>
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
    this.$fireAuth.onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("user/auth", {
          user: { ...user, photoURL: user.photoURL || "" },
          createIfNew: true
        });
      } else {
        this.$store.dispatch("user/auth", { user: null });
      }
    });

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
