<template>
  <v-card class="mb-5">
    <v-card-actions class="primary">
      <v-btn color="white" text @click="showForm = !showForm" block>
        Create a post
        <v-icon right>{{
          showForm ? "mdi-chevron-up" : "mdi-chevron-down"
        }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <v-form
        @submit.prevent="handleCreatePost"
        ref="form"
        class="px-4 py-2"
        v-show="showForm"
      >
        <v-text-field
          label="Title"
          placeholder="Give your post a title..."
          v-model="title"
          color="accent"
        ></v-text-field>
        <v-textarea
          filled
          placeholder="Content of your post..."
          label="Post content"
          v-model="content"
          color="accent"
          :rules="contentRules"
        ></v-textarea>
        <v-file-input
          placeholder="upload images"
          label="Post media"
          multiple
          chips
          prepend-icon="mdi-image"
          color="accent"
          accept=".jpg,.jpeg,.png"
          @change="handleFileChange"
          v-model="files"
        />
        <div v-if="!finishedUploading">
          <v-fade-transition
            v-for="(mediaItem, i) in media"
            v-if="files[i]"
            :key="files[i].name"
          >
            <div class="mb-6">
              <p class="mb-1">{{ files[i].name }}</p>
              <v-progress-linear
                :value="Math.floor(mediaItem.progress || 0)"
                color="accent"
              />
            </div>
          </v-fade-transition>
        </div>
        <v-fade-transition v-else>
          <p class="success--text">Finished uploading!</p>
        </v-fade-transition>
        <v-btn
          type="submit"
          color="accent"
          :loading="loading || (!finishedUploading && !!media.length)"
          >Create post</v-btn
        >
      </v-form>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { v4 as uuid } from "uuid";

export default {
  name: "CreatePost",
  data() {
    return {
      showForm: false,
      title: "",
      content: "",
      contentRules: [v => !!v || "The content of the post is required"],
      loading: false,
      files: [],
      mediaId: uuid(),
      media: [],
      previousFileNames: []
    };
  },
  computed: {
    finishedUploading() {
      return this.media.length && this.media.every(item => item.completed);
    }
  },
  methods: {
    ...mapActions("posts", ["createPost"]),
    async handleCreatePost() {
      if (!this.media.length && !this.$refs.form.validate()) return;
      this.loading = true;
      await this.createPost({
        post: {
          content: this.content || "",
          title: this.title || "",
          media: this.media.map(item => item.url),
          mediaId: this.mediaId,
          mediaPaths: [...this.previousFileNames]
        }
      });
      this.loading = false;
      this.mediaId = uuid();
      this.previousFileNames = [];
      this.$refs.form.reset();
    },

    async handleFileChange() {
      try {
        await Promise.all(
          this.previousFileNames.map(fileName =>
            this.$fireStorage.ref(fileName).delete()
          )
        );
      } catch (e) {}
      this.previousFileNames = [];
      this.media = this.files.map(file => ({
        name: file.name,
        filePath: `${this.mediaId}/${file.name}`
      }));
      this.files.forEach((file, i) => {
        const ref = this.$fireStorage.ref(`${this.mediaId}/${file.name}`);
        const task = ref.put(file);
        task.on(
          "state_changed",
          snapshot => {
            this.media = this.media.map((item, index) =>
              index === i
                ? {
                    ...item,
                    progress:
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                    completed: false
                  }
                : item
            );
          },
          err => {
            console.error(err);
          },
          async () => {
            const newMedia = [...this.media];
            newMedia[i].completed = true;
            newMedia[i].url = await ref.getDownloadURL();
            this.media = newMedia;
          }
        );
        this.previousFileNames.push(`${this.mediaId}/${file.name}`);
      });
    }
  }
};
</script>

<style scoped></style>
