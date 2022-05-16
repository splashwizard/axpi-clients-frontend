const _ = require("lodash");
import axios from "axios";

export default {
  data() {
    return {
      dropdownsLoading: {},
    };
  },
  methods: {
    generateCheckboxId(type, val) {
      return this._uid + "-" + type + "-checkbox-" + val;
    },

    createErrorList(arr) {
      var list = document.createElement("div");
      for (var i = 0; i < arr.length; i++) {
        var item = document.createElement("div");
        item.appendChild(document.createTextNode(arr[i]));
        item.appendChild(document.createElement("br"));
        list.appendChild(item);
      }
      return list;
    },

    getErrorsAsArray(e) {
      var errors;
      if (typeof e.response.data === "object") {
        errors = _.flatten(_.toArray(e.response.data.errors));
      } else {
        errors = ["Something went wrong. Please try again."];
      }
      return errors;
    },

    setErrors(e) {
      this.serverErrors = this.getErrorsAsArray(e);
    },

    getDropdownOptions(field, localPropertyName) {
      let vm = this;
      vm.dropdownsLoading[field] = true;

      return new Promise((resolve, reject) => {
        axios
          .post(window.API_COMMON_BASE + "/get-dropdown-options", {
            field: field,
          })
          .then((r) => {
            vm[localPropertyName] = r.data;
            vm.dropdownsLoading[field] = false;
            resolve(r.data);
          })
          .catch((e) => {
            console.log(e);
            this.$message.error("Error loading options for " + field);
            reject(e);
          });
      });
    },

    isDropdownLoading(field) {
      return this.dropdownsLoading[field] === true;
    },
  },
};
