<template>
  <div>
    <v-btn color="white" class="mb-2" light block large @click="loginWithGoogle">
      <v-icon left>mdi-google</v-icon>
      <span>Sign in with google</span>
    </v-btn>
  </div>
</template>

<script>
  import { mapActions } from "vuex"
  export default {
    name: "AuthButtons",
    methods: {
      ...mapActions("user", ["loginWithGoogle"])
    }
  }
</script>

<style scoped>

</style>
