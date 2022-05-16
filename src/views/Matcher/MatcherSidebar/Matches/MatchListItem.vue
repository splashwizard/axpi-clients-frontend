<template>
  <a-list-item>
    <template v-if="item">
      <toggle-match-selected-button slot="actions" :match="item"></toggle-match-selected-button>
      <a-list-item-meta>
        <div slot="title">{{ item["name"] }}</div>
        <div slot="description" class="product-description">
          <div v-if="showMoreDetails">
            <b>Manufacturer: </b>{{ item["manufacturer"] }} <br />
            <b>Product Code: </b>{{ item["productCode"] }} <br />
            <b>Catalog Code: </b>{{ item["catalogCode"] }} <br />
            <b>Quantity: </b>{{ item["quantity"] }} <br />
            <b>Country: </b>{{ item["country"] }} <br />
            <b>Buying Unit: </b
            >{{
              item["normalisedQuantity"] && item["normalisedQuantity"]["unit"]
                ? item["normalisedQuantity"]["unit"]
                : "-"
            }}
            <br />
            <a href="#" style="margin-top: 5px" @click.prevent="toggleShowMoreDetails"
              >View less
              <a-icon :style="{ fontSize: '10px' }" type="up" />
            </a>
          </div>
          <div v-else>
            <a href="#" @click.prevent="toggleShowMoreDetails"
              >View more
              <a-icon type="down" :style="{ fontSize: '10px' }" />
            </a>
          </div>
        </div>
        <a slot="avatar" target="_blank" :href="item['URL']">
          <a-avatar size="large" :src="getImageSrc(item)" />
        </a>
      </a-list-item-meta>
    </template>
    <template v-else>
      <a-spin v-if="isLoadingItem"></a-spin>
    </template>
  </a-list-item>
</template>

<script>
import ToggleMatchSelectedButton from "../ToggleMatchSelectedButton";
import axios from "axios";

export default {
  name: "MatchListItem",
  props: ["listItem"],
  data() {
    return {
      showMoreDetails: false,
      loadedItem: null,
      isLoadingItem: false,
    };
  },
  computed: {
    item() {
      if (this.listItem.type === "product") {
        return this.listItem.value;
      }
      return this.loadedItem;
    },
  },
  created() {
    console.log(this.listItem);
    if (this.listItem.type == "id") {
      this.loadItem();
    }
  },
  components: { ToggleMatchSelectedButton },
  methods: {
    getImageSrc(order) {
      if (order["imageURLs"] && order["imageURLs"].length) {
        return order["imageURLs"][0];
      }
    },

    toggleShowMoreDetails() {
      this.showMoreDetails = !this.showMoreDetails;
    },

    loadItem() {
      let vm = this;
      vm.isLoadingItem = true;
      axios
        .post(window.API_BASE + "/matcher/get-product-by-id", {
          id: this.listItem.value,
        })
        .then((r) => {
          this.isLoadingItem = false;
          this.loadedItem = r.data;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error loading item");
        });
    },
  },
};
</script>

<style scoped></style>
