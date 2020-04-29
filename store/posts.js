export const state = () => ({
  posts: []
});

export const getters = {
  posts(state) {
    return state.posts;
  }
};

export const mutations = {
  setPosts(state, posts) {
    state.posts = posts;
  },
  addPost(state, post) {
    state.posts.push(post);
  },
  removePost(state, id) {
    state.posts = state.posts.filter(post => post.id !== id);
  },
  updatePost(state, post) {
    state.posts = state.posts.map(oldPost =>
      oldPost.id === post.id ? post : oldPost
    );
  }
};
