<template>
  <v-list-item>
    <v-list-item-avatar class="mr-2" v-if="comment.user && comment.user.avatar">
      <v-img :src="comment.user.avatar" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-card-title class="pb-1" v-if="comment.user">{{
        comment.user.name || "Anonymous"
      }}</v-card-title>
      <v-card-text>{{ comment.content }}</v-card-text>
    </v-list-item-content>
    <v-list-item-icon v-if="isLoggedIn && comment.uid === user.id">
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="handleDeleteComment">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
          <v-list-item @click="showSheet">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item-icon>

    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <v-container>
          <v-form @submit.prevent="handleEditComment">
            <v-textarea
              v-model="commentEdit"
              label="Edit your comment"
              color="accent"
              filled
              clearable
              rows="2"
              autofocus
            ></v-textarea>
            <v-btn type="submit" color="accent">Update comment</v-btn>
            <v-btn text @click="sheet = false">Cancel</v-btn>
          </v-form>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
  </v-list-item>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Comment",
  props: ["post", "comment"],
  data() {
    return {
      commentEdit: this.comment.content,
      sheet: false
    };
  },
  computed: {
    ...mapGetters("user", ["isLoggedIn", "user"])
  },
  methods: {
    ...mapActions("user", ["setLoginModal"]),
    ...mapActions("posts", ["sendComment", "deleteComment", "editComment"]),

    showSheet() {
      this.commentEdit = this.comment.content;
      this.sheet = true;
    },
    async handleDeleteComment() {
      await this.deleteComment({
        comment: this.comment,
        post: this.post
      });
    },
    async handleEditComment() {
      this.sheet = false;
      await this.editComment({
        comment: { ...this.comment, content: this.commentEdit },
        post: this.post
      });
    }
  }
};
</script>

<style scoped></style>
