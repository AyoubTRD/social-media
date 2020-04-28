<template>
  <div class="text-center">
    <v-dialog v-model="loginModal" max-width="500">
      <v-card>
        <v-card-title class="title">Sign into your account</v-card-title>
        <v-list-item>
          <v-form @submit.prevent="handleSubmit" style="width: 100%" ref="form">
            <v-text-field prepend-icon="mdi-email" id="email" type="email" label="email" v-model="email" required outlined autofocus :rules="emailRules" />
            <v-text-field prepend-icon="mdi-lock" id="password" type="password" label="password" v-model="password" outlined required :rules="passwordRules" />
            <div class="pb-3">
              <v-btn type="submit" block color="primary" :loading="$store.state.user.loginLoading" large>Sign in</v-btn>
              <v-divider class="my-4" />
              <AuthButtons/>
              <p class="red--text" v-if="$store.state.user.loginError">{{ $store.state.user.loginError }}</p>
            </div>

          </v-form>
        </v-list-item>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from "vuex"
  import AuthButtons from "./AuthButtons";

  export default {
    name: "LoginModal",
    components: {AuthButtons},
    data() {
      return {
        email: "",
        emailRules: [ v => !!v || "The email is required"],
        password: "",
        passwordRules: [v => !!v || "The password is required"]
      }
    },
    computed: {
      loginModal: {
        get() {
          return this.$store.state.user.loginModal
        },
        set(value) {
          this.$store.commit("user/setLoginModal", value)
        }
      }
    },
    methods: {
      ...mapActions("user", ["loginWithEmailAndPassword"]),
      handleSubmit() {
        if(this.$refs.form.validate()) {
          const { email, password } = this
          this.loginWithEmailAndPassword({ email, password })
          this.$refs.form.reset()
        }
      }
    }
  }
</script>

<style scoped>

</style>
