export default {
    methods: {
        getImageSrc(filename) {
           return window.IMAGE_STORAGE_BASE + '/' + filename;
        }
    }
}