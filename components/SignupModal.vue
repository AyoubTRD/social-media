<template>
  <div class="text-center">
    <v-dialog v-model="signupModal" max-width="500">
      <v-card>
        <v-card-title class="title">Create an account</v-card-title>
        <v-list-item>
          <v-form @submit.prevent="handleSubmit" style="width: 100%" ref="form">
            <v-text-field prepend-icon="mdi-email" id="email" type="email" label="email" v-model="email" required outlined autofocus :rules="emailRules" />
            <v-text-field prepend-icon="mdi-lock" id="password" type="password" label="password" v-model="password" outlined required :rules="passwordRules" />
            <div class="pb-3">
              <v-btn type="submit" block color="primary" :loading="$store.state.user.signupLoading" large>Sign up</v-btn>
              <v-divider class="my-4" />
              <AuthButtons/>
              <p class="red--text" v-if="$store.state.user.signupError">{{ $store.state.user.signupError }}</p>
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
    name: "SignupModal",
    components: {AuthButtons},
    data() {
      return {
        email: "",
        emailRules: [ v => !!v || "The email is required"],
        password: "",
        passwordRules: [v => (!!v && v.length >= 6) || "The password should be at least 6 characters"]
      }
    },
    computed: {
      signupModal: {
        get() {
          return this.$store.state.user.signupModal
        },
        set(value) {
          this.$store.commit("user/setSignupModal", value)
        }
      }
    },
    methods: {
      ...mapActions("user", ["signupWithEmailAndPassword"]),
      handleSubmit() {
        if(this.$refs.form.validate()) {
          const { email, password } = this
          this.signupWithEmailAndPassword({ email, password })
          this.$refs.form.reset()
        }
      }
    },
    updated() {
      console.log(this.$fireAuth.currentUser)
    }
  }
</script>

<style scoped>

</style>
