<template>
  <div>
    <a-button type="primary" icon="upload" @click="showModal">Upload CSV</a-button>
    <loading-screen :is-loading="isSaving"></loading-screen>

    <a-modal
      :centered="true"
      :width="700"
      :mask-closable="false"
      ok-text="Save"
      v-model="shouldShowModal"
      title="Upload CSV"
      @ok="attemptParseAndSave"
    >
      <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
        <a-button>
          <a-icon type="upload" />
          Select File
        </a-button>
      </a-upload>
    </a-modal>
  </div>
</template>

<script>
import Papa from "papaparse";
import axios from "axios";

const _ = require("lodash");
import moment from "moment";

export default {
  name: "UploadCsvButtonAndModal",
  props: ["orderLocal", "addresses"],
  data() {
    return {
      shouldShowModal: false,
      fileList: [],
      isSaving: false,
    };
  },
  methods: {
    showModal() {
      this.shouldShowModal = true;
    },

    closeModal() {
      this.shouldShowModal = false;
    },

    attemptParseAndSave() {
      if (this.fileList.length !== 1) {
        alert("Please upload a CSV");
        return false;
      }

      let vm = this;
      vm.isSaving = true;

      Papa.parse(this.fileList[0], {
        header: true,
        complete: function (results) {
          console.log("Finished:", results.data);
          // vm.isSaving = false;

          let totalCount = results.data.length;
          let totalSaved = 0;

          _.each(results.data, function (result) {
            let address = {
              address_line_one: result["Address Line One"],
              address_line_two: result["Address Line Two"],
              city: result["City"],
              province: result["Province"],
              country: result["Country"],
              postal_code: result["Postal Code"],
            };

            axios
              .post(window.API_BASE + "/addresses", address)
              .then((r) => {
                totalSaved++;

                vm.addresses.push(r.data);
                vm.orderLocal.delivery_locations.push({
                  quantity: result["Quantity"],
                  ship_using: result["Ship Using"],
                  shipping_method: result["Shipping Method"],
                  date_shipped: moment(result["Date Shipped"], "YYYY-MM-DD").isValid()
                    ? moment(result["Date Shipped"], "YYYY-MM-DD")
                    : null,
                  address_id: r.data.id,
                });

                if (totalCount === totalSaved) {
                  vm.isSaving = false;
                  vm.fileList = [];
                  vm.shouldShowModal = false;
                  vm.$emit("csvs-uploaded");
                }
              })
              .catch((e) => {
                console.log(e);
                totalSaved++;
                if (totalCount === totalSaved) {
                  vm.isSaving = false;
                  vm.fileList = [];
                  vm.shouldShowModal = false;
                  vm.$emit("csvs-uploaded");
                }
              });
          });
        },
      });
    },

    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
  },
};
</script>

<style scoped></style>
