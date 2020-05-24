<template>
  <v-card dark>
    <v-toolbar color="primary">
      <v-avatar>
        <v-img :src="profile.avatar" />
      </v-avatar>
      <v-toolbar-title class="ml-6">{{ profile.name || "Anonymous" }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn icon nuxt :to="`/chat/${profile.id}`">
        <v-icon>mdi-message-processing</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ProfileBar",
  computed: {
    ...mapGetters("user", ["profile", "isLoggedIn"])
  }
};
</script>