<template>
  <v-card class="post">
    <v-img v-if="post.media && post.media.length === 1" :src="post.media[0]" />

    <v-carousel
      cycle
      height="400"
      hide-delimiter-background
      show-arrows-on-hover
      v-else-if="post.media && post.media.length > 1"
    >
      <v-carousel-item v-for="mediaItem in post.media" :key="mediaItem">
        <v-img :src="mediaItem" />
      </v-carousel-item>
    </v-carousel>

    <v-list-item three-line v-if="!isEditing">
      <v-list-item-content>
        <span class="overline">{{ postCreationTime }}</span>
        <v-card-title class="headline pb-2" v-if="post.title">
          {{
          post.title
          }}
        </v-card-title>
        <v-card-text v-if="post.content">{{ post.content }}</v-card-text>
      </v-list-item-content>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-list-item-avatar
            v-if="post.user"
            v-on="on"
            @click="$router.push(`/profile/${post.uid}`)"
            style="cursor: pointer"
          >
            <v-img :src="post.user.avatar" />
          </v-list-item-avatar>
        </template>
        <span v-if="post.user">{{ post.user.name }}</span>
      </v-tooltip>
    </v-list-item>
    <v-list-item v-else>
      <v-list-item-content>
        <span class="overline">{{ post.createdAt }}</span>

        <v-form @submit.prevent="handleEditPost" ref="editForm">
          <v-text-field v-model="title" color="accent" label="Post title"></v-text-field>
          <v-textarea
            v-model="content"
            color="accent"
            label="Post content"
            :rules="contentRules"
            filled
          ></v-textarea>
          <v-btn type="submit" rounded color="accent" :loading="editLoading">Update post</v-btn>
          <v-btn @click="isEditing = false" text color="secondary">Cancel</v-btn>
        </v-form>
      </v-list-item-content>
    </v-list-item>
    <v-card-actions>
      <v-btn
        color="primary"
        class="mr-2"
        small
        dark
        elevation="0"
        :text="!post.isLiked"
        fab
        @click="like"
      >
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <span class="primary--text">{{ post.likes || 0 }} {{ post.likes === 1 ? "like" : "likes" }}</span>
      <v-spacer />
      <span v-if="post.comments" class="mr-2">
        {{ post.comments }}
        {{ post.comments === 1 ? "comment" : "comments" }}
      </span>
      <v-btn icon @click="showComments = !showComments">
        <v-icon>
          {{
          showComments ? "mdi-chevron-up" : "mdi-chevron-down"
          }}
        </v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="showComments">
        <v-form @submit.prevent="createComment">
          <v-textarea
            color="primary"
            v-model="comment"
            label="Write a comment..."
            filled
            class="commentInput"
          />
          <v-card-actions>
            <v-btn type="submit" color="primary" rounded>
              <span>Comment</span>
              <v-icon right>mdi-send</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
        <v-divider></v-divider>
        <Comment
          v-if="comments"
          :post="post"
          v-for="comment in comments"
          :comment="comment"
          :key="comment.id"
        />
      </div>
    </v-expand-transition>
    <v-card-actions>
      <v-btn v-if="showLink" color="accent" text nuxt :to="`/posts/${post.id}`">See full post</v-btn>
      <v-spacer></v-spacer>
      <v-menu bottom left v-if="isLoggedIn && post.uid === user.id">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="handleDeletePost">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
          <v-list-item @click="startEditing">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import { formatDistanceToNow } from "date-fns";

import Comment from "./Comment";
export default {
  components: { Comment },
  props: ["post", "comments", "showLink"],
  name: "Post",
  data() {
    return {
      showComments: false,
      comment: "",
      sheet: false,
      isEditing: false,
      content: "",
      title: "",
      contentRules: [v => !!v || "The content of the post is required"],
      editLoading: false
    };
  },
  computed: {
    ...mapGetters("user", ["isLoggedIn", "user"]),
    postCreationTime() {
      return (
        formatDistanceToNow(
          this.post.createdAt
            ? new Date(this.post.createdAt.seconds * 1000)
            : new Date()
        ) + " ago"
      );
    }
  },
  methods: {
    ...mapActions("posts", [
      "likePost",
      "deletePost",
      "sendComment",
      "deleteComment",
      "editPost"
    ]),
    ...mapMutations("user", ["setLoginModal"]),
    async like() {
      if (!this.isLoggedIn) return this.setLoginModal(true);
      await this.likePost(this.post);
    },
    async createComment() {
      if (!this.comment) return;
      if (!this.isLoggedIn) return this.setLoginModal(true);
      await this.sendComment({
        comment: { content: this.comment },
        post: this.post
      });
      this.comment = "";
    },
    async handleDeletePost() {
      await this.deletePost({
        post: this.post
      });
    },
    async handleEditPost() {
      if (
        (!this.post.media || !this.post.media.length) &&
        !this.$refs.editForm.validate()
      )
        return;
      this.editLoading = true;
      await this.editPost({
        post: {
          ...this.post,
          title: this.title || "",
          content: this.content || ""
        }
      });
      this.editLoading = false;
      this.isEditing = false;
    },
    startEditing() {
      this.isEditing = true;
      this.title = this.post.title;
      this.content = this.post.content;
    }
  }
};
</script>

<style scoped></style>
