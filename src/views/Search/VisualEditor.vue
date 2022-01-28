<template>
  <a-layout>
    <sidebar :toggleAddDrawer="toggleAddDrawer" :toggleEditDrawer="toggleEditDrawer" :triggerData="triggerData"></sidebar>
    <div class="wrapper">
      <div class="content">
        <p class="description">Here are the results as they would appear with no query.</p>
        <div class="cards">
          <search-item v-for="(item, index) in searchResults" :key="index" :item="item" />
        </div>
        <add-drawer :drawerVisible="addDrawerVisible" :drawerType="addDrawerType" :drawerClose="addDrawerClose" :addDrawer="addDrawer" />
        <edit-drawer :drawerVisible="editDrawerVisible" :drawerType="editDrawerType" :drawerClose="editDrawerClose" :editDrawer="editDrawer" 
          :editDrawerItem="editDrawerItem"/>
      </div>
    </div>
  </a-layout>
</template>

<script>
// import RulesTable from "./Rules/Table";
import Sidebar from "./VisualEditor/Sidebar";
import AddDrawer from "./VisualEditor/AddDrawer";
import EditDrawer from "./VisualEditor/EditDrawer";
import SearchItem from './VisualEditor/SearchItem';

export default {
  name: "Landing",
  components: { Sidebar, AddDrawer, EditDrawer, SearchItem },
  data() {
    return {
      addDrawerType: 'condition',
      addDrawerVisible: false,
      editDrawerType: 'condition',
      editDrawerVisible: false,
      editDrawerIndex: 0,
      editDrawerItem: {
        query: { option: 'starts_with', keyword: '' },
        filters: []
      },
      triggerData: {
        between: null,
        query_conditions: [
          // {
          //   query: { option: 'contains', keyword: 'tip' },
          //   filters: [
          //     { name: 'Bottom Style', keyword: 'abc' },
          //     { name: 'Capacity', keyword: 'big' }
          //   ]
          // },
          // {
          //   query: { option: 'starts_with', keyword: 'manual' },
          //   filters: []
          // }
        ]
      },
      searchResults: [
        {id: 1, title: 'SGE Syringes, General Purpose Manual Syringe, PTFE Tipped Plunger, Trajan Scientific and Medical', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 2, title: 'SGE Syringes, General Purpose Manual Syringe, PTFE Tipped Plunger, Trajan Scientific and Medical', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 3, title: 'Vacuum Traps, Dewar Type with Ace-Thred Inlet/Outlet, Ace Glass', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'}
      ]
    }
  },
  methods: {
    toggleAddDrawer(type) {
      this.editDrawerVisible = false;
      if (!this.addDrawerVisible) {
        this.addDrawerVisible = true;
        this.addDrawerType = type;
      } else {
        if (this.addDrawerType !== type){
          this.addDrawerType = type;
        }
        else {
          this.addDrawerVisible = false;
        }
      }
    },

    toggleEditDrawer(index) {
      this.addDrawerVisible = false;
      this.editDrawerIndex = index;
      this.editDrawerItem = this.triggerData.query_conditions[index];
      this.editDrawerVisible = true;
    },
    addDrawerClose() {
      this.addDrawerVisible = false;
    },
    addDrawer(drawerData) {
      this.triggerData.query_conditions = [...this.triggerData.query_conditions, drawerData];
      this.addDrawerVisible = false;
    },

    editDrawer(drawerData) {
      this.triggerData.query_conditions[this.editDrawerIndex] = drawerData;
      this.editDrawerVisible = false;
    },
    editDrawerClose() {
      this.editDrawerVisible = false;
    },
  }
}
</script>

<style scoped>
  .wrapper {
    flex: 1 1 0%;
    overflow: hidden;
    position: relative;
  }
  .content {
    width: 100%;
    height: 100vh;
  }
  .description {
    margin: 0 172px;
    padding: 80px 0 24px 0;
  }

  .cards {
    margin: 0 172px;
  }
</style>