export default {
  methods: {
    getImageSrc(filename) {
      return window.IMAGE_STORAGE_BASE + "/" + filename;
    },

    getAvatar(user) {
      let nameToPass = user.name.split(" ").join("+");
      return "https://eu.ui-avatars.com/api/?name=" + nameToPass + "&color=fff&background=E6E5E9";
    },
  },
};
