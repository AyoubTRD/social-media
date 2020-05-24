<template>
  <div class="chat">
    <h1 class="heading">{{ profile.name }}</h1>
    <v-form @submit.prevent="handleSubmit">
      <v-text-field v-model="message" placeholder="Type your message here..."></v-text-field>
      <v-btn type="submit">Send</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      message: "",
      authDone: false
    };
  },
  computed: {
    ...mapGetters("user", ["profile", "user", "isLoggedIn"])
  },
  methods: {
    handleSubmit() {
      this.$fireStore.collection("messages").add({
        from: this.user.id,
        to: this.profile.id,
        message: this.message,
        createdAt: new Date()
      });
    },
    messagesHandler() {
      console.log("Loeuf is here");
      this.unsubscribe = this.messagesRef
        .orderBy("createdAt", "desc")
        .limit(50)
        .onSnapshot(snapshot => {
          snapshot.docChanges.forEach(change => {
            console.log(change);
          });
        });
    },
    initRef() {
      if (!this.isLoggedIn) return;
      console.log("initref")
      const ids = [this.$router.currentRoute.params.id, this.user.id].sort();
      this.messagesRef = this.$fireStore
        .collection("messages")
        .where("user1", "==", ids[0])
        .where("user2", "==", ids[1]);
      this.authDone = true;
    }
  },
  created() {
    this.initRef()
  },
  mounted() {
    this.initRef()
  },
  updated() {
    let setAuthDone = false;
    if (this.authDone) return;
    if (!this.authDone && this.isLoggedIn) {
      this.initRef()
    }
    console.log("Auth successfull");
    this.messagesHandler();

    if (setAuthDone) {
      this.authDone = true;
    }
  },
  async asyncData({ store, params, app, error }) {
    const user = await app.$fireStore
      .collection("users")
      .doc(params.id)
      .get();
    if (!user.exists) {
      error({
        message: "This chat is not found",
        statusCode: 404
      });
      return;
    }
    store.commit("user/setProfile", { ...user.data(), id: user.id });
  },
  destroyed() {
    this.unsubscribe();
  }
};
</script>
