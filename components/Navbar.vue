<template>
  <div>
    <v-app-bar app>
      <nuxt-link to="/" class="text-style-none home-link">
        <v-toolbar-title>
          <v-img src="/logo.svg" class="logo"></v-img>Together
        </v-toolbar-title>
      </nuxt-link>
      <v-spacer />
      <v-btn color="primary" text v-if="!isLoggedIn">Create account</v-btn>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
    </v-app-bar>
    <v-navigation-drawer app light right v-model="drawer" color="accent" class dark>
      <div v-if="!isLoggedIn" class="mt-10">
        <v-list>
          <v-list-item-group>
            <v-list-item @click="setSignupModal(true)">
              <v-list-item-title>Create account</v-list-item-title>
            </v-list-item>
            <v-list-item @click="setLoginModal(true)">
              <v-list-item-title>Sign in</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div class="mt-7" v-else>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="user.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{
                user.name || "Anonymous"
                }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item-group color="primary" class="mt-3 text--lighten-3">
            <v-list-item to="/" nuxt>
              <v-spacer />
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
            <v-list-item @click="expandAccount = !expandAccount">
              <v-list-item-title>Account</v-list-item-title>
              <v-list-item-icon>
                <v-icon>{{ expandAccount ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
          <v-expand-transition>
            <v-list-item-group v-show="expandAccount">
              <v-list-item :to="`/profile/${user.id}`" nuxt>
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>My profile</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Sign out</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-expand-transition>
        </v-list>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Navbar",
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
  }
};
</script>