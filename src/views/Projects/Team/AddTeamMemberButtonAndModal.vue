<template>
  <div>
    <a-button type="primary" icon="plus" @click.prevent="showModal"> Add Team Members </a-button>
    <a-modal :width="700" v-model="visible" :centered="true" title="Add Team Members To Project" :footer="null">
      <loading-screen :is-loading="isSaving"></loading-screen>

      <!-- Users table -->
      <div v-if="stage === 1">
        <div style="margin-bottom: 20px; text-align: left">
          <a-input-search placeholder="Search users" v-model="searchQuery" style="width: 300px" @search="fetch" />
        </div>

        <a-table
          :key="reloadKey"
          class="axpi-table"
          :columns="columns"
          :row-selection="rowSelection"
          :row-key="(record) => record['id']"
          :data-source="data"
          :pagination="pagination"
          :loading="loading || searchQueryIsDirty || isLoadingRoles"
          @change="handleTableChange"
        >
        </a-table>

        <div style="text-align: right; margin-top: 15px">
          <a-button :disabled="!canSave" type="primary" @click="assignPermissions">Next </a-button>
        </div>
      </div>
      <!-- / Users table -->

      <!-- Permissions selector -->
      <div v-if="stage === 2">
        <!-- Is loading fleshed users -->
        <div v-if="isLoadingFleshedUsers">
          <div class="text-center">
            <a-spin></a-spin>
          </div>
        </div>
        <!-- / Is loading fleshed users -->

        <!-- Fleshed users loaded -->
        <div v-if="!isLoadingFleshedUsers">
          <!-- Users -->
          <div v-for="(userId, i) in selectedUserIds" :key="i" class="user-permission-block">
            <div v-if="getFleshedUser(userId)">
              <b>{{ getFleshedUser(userId).name }}</b>
              <div class="checkbox-group-wrapper">
                <a-checkbox-group v-model="userRolesMap[userId]" :options="roleOptions" />
              </div>
            </div>
            <div v-else>
              <b class="text-danger">Can't find fleshed user</b>
            </div>
          </div>
          <!-- / Users -->

          <!-- Actions -->
          <div style="text-align: right; margin-top: 15px">
            <a-button type="default" @click="goBack" style="margin-right: 10px"> Back </a-button>

            <a-button :disabled="!canSave" type="primary" @click="save"> Save </a-button>
          </div>
          <!-- / Actions -->
        </div>
        <!-- / Fleshed users loaded -->
      </div>
      <!-- / Permissions selector -->
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";

const _ = require("lodash");

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: true,
  },
];

export default {
  name: "AddTeamMemberToButtonAndModal",
  props: ["projectId"],
  data() {
    return {
      visible: false,

      isSaving: false,
      serverErrors: [],

      loading: false,
      data: [],
      pagination: {},
      searchQuery: "",
      searchQueryIsDirty: false,
      selectedUserIds: [],

      isLoadingRoles: false,
      roles: [],

      isLoadingFleshedUsers: false,
      fleshedUsers: [],
      userRolesMap: {},

      columns,

      reloadKey: 1,
      stage: 1,
    };
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true;
      this.fetch();
    },
  },
  methods: {
    showModal() {
      this.visible = true;
      this.data = [];
      this.pagination = {};
      this.searchQueryIsDirty = false;
      this.selectedUserIds = [];

      this.userRolesMap = [];

      this.stage = 1;
      this.reloadKey += 1;
      this.loadRoles();
      this.fetch();
    },

    save() {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/projects/" + this.projectId + "/team/add-users", {
          user_ids: this.selectedUserIds,
          user_roles_map: this.userRolesMap,
        })
        .then(() => {
          vm.visible = false;
          vm.isSaving = false;
          vm.$message.success("Team members added successfully");
          vm.$emit("reload");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error adding team members");
        });
    },

    determineSearchParams(params) {
      return {
        results_per_page: 10,
        q: this.searchQuery,
        ...params,
      };
    },

    loadRoles() {
      let vm = this;
      vm.isLoadingRoles = true;
      axios
        .get(window.API_BASE + "/project-roles")
        .then((r) => {
          vm.roles = r.data;
          vm.isLoadingRoles = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoadingRoles = false;
          vm.roles = [];
          vm.$message.error("Error loading roles");
        });
    },

    fetchFleshedUsers() {
      let vm = this;
      vm.isLoadingFleshedUsers = true;
      vm.fleshedUsers = [];
      axios
        .post(window.API_BASE + "/users/get-from-ids", {
          user_ids: vm.selectedUserIds,
        })
        .then((r) => {
          vm.isLoadingFleshedUsers = false;
          vm.fleshedUsers = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoadingFleshedUsers = false;
        });
    },

    getFleshedUser(userId) {
      return _.find(this.fleshedUsers, { id: userId });
    },

    fetch: _.debounce(function (params = {}) {
      this.loading = true;
      axios
        .post(window.API_BASE + "/users/search", this.determineSearchParams(params))
        .then((r) => {
          const pagination = { ...this.pagination };
          // Read total count from server
          pagination.total = r.data.total;
          this.loading = false;
          this.data = r.data.data;
          this.pagination = pagination;
          this.searchQueryIsDirty = false;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error searching users");
        });
    }, 500),

    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results_per_page: pagination.pageSize,
        page: pagination.current,
        sort_field: sorter.field,
        sort_order: sorter.order,
        ...filters,
      });
    },

    assignPermissions() {
      if (this.canAssignPermissions) {
        this.stage += 1;
      }
      this.fetchFleshedUsers();
    },

    goBack() {
      this.stage -= 1;
    },
  },

  computed: {
    roleOptions() {
      return _.map(this.roles, (role) => {
        return {
          label: role.name,
          value: role.id,
        };
      });
    },

    canAssignPermissions() {
      return this.selectedUserIds.length > 0;
    },

    canSave() {
      return this.selectedUserIds.length > 0;
    },

    rowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          this.selectedUserIds = selectedRowKeys;
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
  },
};
</script>

<style scoped lang="scss">
.user-permission-block {
  margin-bottom: 20px;

  .checkbox-group-wrapper {
    margin-top: 5px;
  }
}

.text-center {
  text-align: center;
}
</style>
