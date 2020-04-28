export const state = () => ({
  user: null,
  error: false,
  signupModal: false,
  loginModal: false,
  signupError: "",
  loginError: "",
  signupLoading: false,
  loginLoading: false,
  signoutLoading: false
});

export const getters = {
  isLoggedIn(state) {
    return !!state.user;
  },
  signupModal(state) {
    return state.signupModal;
  },
  loginModal(state) {
    return state.loginModal;
  },
  signupError(state) {
    return state.sigupError;
  },
  loginError(state) {
    return state.sigupError;
  },
  signupLoading(state) {
    return state.signupLoading;
  },
  loginLoading(state) {
    return state.loginLoading;
  }
};

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setError(state, error) {
    state.error = error;
  },
  setSignupModal(state, payload) {
    state.signupModal = payload;
  },
  setLoginModal(state, payload) {
    state.loginModal = payload;
  },
  setSignupError(state, payload) {
    state.signupError = payload;
  },
  setLoginError(state, payload) {
    state.loginError = payload;
  },
  setSignupLoading(state, payload) {
    state.signupLoading = payload;
  },
  setLoginLoading(state, payload) {
    state.loginLoading = payload;
  },
  setSignoutLoading(state, payload) {
    state.signoutLoading = payload;
  }
};

export const actions = {
  async auth({ commit }, payload) {
    if (payload.user) {
      console.log("Signing user in...");
      const {
        user: { displayName: name, email, photoURL: avatar, uid: id },
        createIfNew
      } = payload;
      const userRef = this.$fireStore.collection("users").doc(id);
      let dbUser = await userRef.get();
      if (createIfNew && !dbUser.exists) {
        await userRef.set({ name, email, avatar, id });
        dbUser = await this.$fireStore
          .collection("users")
          .doc(id)
          .get();
      }
      console.log(dbUser);
      commit("setUser", dbUser.data());
    } else {
      commit("setUser", null);
    }
    commit("setSignupModal", false);
    commit("setLoginModal", false);
  },
  async loginWithGoogle({ commit, dispatch }) {
    try {
      const provider = new this.$fireAuthObj.GoogleAuthProvider();
      const { user } = await this.$fireAuth.signInWithPopup(provider);
      await dispatch("auth", { user, createIfNew: true });

      // commit("setError", true)
    } catch (e) {
      console.error(e);
    }
  },
  async loginWithEmailAndPassword({ commit, dispatch }, creds) {
    commit("setLoginLoading", true);
    try {
      await this.$fireAuth.signInWithEmailAndPassword(
        creds.email,
        creds.password
      );
    } catch (e) {
      console.error(e);
      commit("setLoginError", e.message);
    }
    commit("setLoginLoading", false);
  },
  async signupWithEmailAndPassword({ commit, dispatch }, creds) {
    commit("setSignupLoading", true);
    try {
      await this.$fireAuth.createUserWithEmailAndPassword(
        creds.email,
        creds.password
      );
    } catch (e) {
      console.error(e);
      commit("setSignupError", e.message);
    }
    commit("setSignupLoading", false);
  },
  async logout({ commit }) {
    await this.$fireAuth.signOut();
    commit("setSignoutLoading", false);
  }
};
