<template>
  <div class="shop-basket">
    <a-layout style="padding: 7px 30px">
      <div>
        <a-page-header title="Lists" @back="goBackToShop">
          <template slot="extra">
            <a-button icon="plus" type="primary" @click="showCreateListModal">Create New List</a-button>
          </template>
        </a-page-header>
      </div>
      <a-card :bodyStyle="{ padding: 0 }">
        <lists-table
          :searchTerm="searchTerm"
          :lists="list"
          :updateVisible="updateVisible"
          :viewList="viewList"
          :handleEditList="handleEditList"
          :handleDeleteList="handleDeleteList"
        />
      </a-card>
    </a-layout>
    <a-modal v-model="createListModalVisible" title="Create New List" @ok="handleCreateListModal">
      <a-form :form="createListForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="List">
          <a-input v-decorator="['name', { rules: [{ required: true, message: 'Please input list name!' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="editListModalVisible" title="Edit List" @ok="handleUpdateListModal">
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item
          label="List"
          :validate-status="editFormData.name.validateStatus"
          :help="editFormData.name.errorMsg"
        >
          <a-input :value="editFormData.name.value" @change="(e) => handleEditListChange(e.target.value)" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model="deleteListModalVisible"
      title="Delete List"
      ok-text="Confirm"
      cancel-text="Cancel"
      @ok="handleDeleteListModal"
      :dialog-style="{ maxWidth: '300px' }"
    >
      <p>Are you sure you want to delete this list?</p>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import client from "@/api/client";
import ListsTable from "./Lists/Table";

function validateList(name) {
  if (name !== "") {
    return {
      validateStatus: "success",
      errorMsg: null,
    };
  }

  return {
    validateStatus: "error",
    errorMsg: "Please input list name!",
  };
}

export default {
  name: "Lists",
  components: { ListsTable },
  mounted() {
    this.getProductsList();
  },
  data() {
    return {
      searchTerm: "",
      createListModalVisible: false,
      formLayout: "horizontal",
      createListForm: this.$form.createForm(this, { name: "createList" }),
      editListModalVisible: false,
      editListId: null,
      editFormData: {
        name: {
          value: "list",
        },
      },
      deleteListModalVisible: false,
      deleteListId: null,
    };
  },
  computed: {
    ...mapGetters("shop", {
      list: "list",
    }),

    ...mapGetters("auth", {
      user: "user",
      unit: "selectedOrganisationalUnit",
    }),
  },
  methods: {
    ...mapActions("shop", {
      createList: "createList",
      editList: "editList",
      deleteList: "deleteList",
    }),

    // API calls
    async getProductsList() {
      const { client_id } = this.user;
      const {
        pivot: { user_id, organisational_unit_id: unit_id },
      } = this.unit;

      if (!client_id || !user_id || !unit_id) {
        return;
      }
    },

    handleEditListChange(value) {
      this.editFormData.name = {
        ...validateList(value),
        value,
      };
    },

    goBackToShop() {
      this.$router.push("/shop");
    },

    updateVisible() {},

    viewList(id) {
      this.$router.push(`/shop/lists/view/${id}`);
    },

    showCreateListModal() {
      this.createListModalVisible = true;
    },

    handleCreateListModal() {
      this.createListForm.validateFields((err, values) => {
        if (!err) {
          this.createList({ name: values.name });
          this.createListModalVisible = false;
        }
      });
    },

    handleEditList(id) {
      this.editListId = id;
      const listIdx = this.list.findIndex((item) => item.id === id);
      this.editFormData.name.value = this.list[listIdx].name;
      this.editListModalVisible = true;
    },

    handleUpdateListModal() {
      if (this.editFormData.name.value) {
        this.editList({ id: this.editListId, name: this.editFormData.name.value });
        this.editListModalVisible = false;
      }
    },

    handleDeleteList(id) {
      this.deleteListId = id;
      this.deleteListModalVisible = true;
    },

    handleDeleteListModal() {
      this.deleteList({ id: this.deleteListId });
      this.deleteListModalVisible = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
