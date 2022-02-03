<template>
  <a-layout>
    <sidebar :toggleAddDrawer="toggleAddDrawer" :toggleEditDrawer="toggleEditDrawer" :editPeriod="editPeriod" :triggerData="triggerData" :strategyData="strategyData"></sidebar>
    <div class="wrapper">
      <div class="content">
        <p class="description">Here are the results as they would appear with no query.</p>
        <div class="cards">
          <search-item v-for="(item, index) in searchResults" :key="index" :item="item" />
        </div>
        <add-drawer :drawerVisible="addDrawerVisible" :drawerType="addDrawerType" :drawerClose="addDrawerClose" :addDrawer="addDrawer" />
        <edit-drawer :drawerVisible="editDrawerVisible" :drawerType="editDrawerType" :drawerClose="editDrawerClose" :updateDrawerItem="updateDrawerItem" 
          :editDrawerItem="editDrawerItem" :setItem="setItem"/>
      </div>
    </div>
  </a-layout>
</template>

<script>
import Typesense from 'typesense';
import Sidebar from "./VisualEditor/Sidebar";
import AddDrawer from "./VisualEditor/AddDrawer";
import EditDrawer from "./VisualEditor/EditDrawer";
import SearchItem from './VisualEditor/SearchItem';

// let schema = {
//   name: 'companies',
//   num_documents: 0,
//   fields: [
//     {
//       name: 'company_name',
//       type: 'string',
//       facet: false
//     },
//     {
//       name: 'num_employees',
//       type: 'int32',
//       facet: false
//     },
//     {
//       name: 'country',
//       type: 'string',
//       facet: true
//     }
//   ],
//   default_sorting_field: 'num_employees'
// }

// let documents = [
//   {
//     id: '124',
//     company_name: 'Stark Industries',
//     num_employees: 5215,
//     country: 'USA'
//   },
//   {
//     id: '125',
//     company_name: 'Acme Corp',
//     num_employees: 1002,
//     country: 'France'
//   },
//   {
//     id: '127',
//     company_name: 'Stark Corp',
//     num_employees: 1031,
//     country: 'USA'
//   },
//   {
//     id: '126',
//     company_name: 'Doofenshmirtz Inc',
//     num_employees: 2,
//     country: 'Tri-State Area'
//   }
// ]

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
        period: [],
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
      strategyData: {
        boostCategories: [],
        buryCategories: [],
        filterResults: []
      },
      searchResults: [
        {id: 1, title: 'SGE Syringes, General Purpose Manual Syringe, PTFE Tipped Plunger, Trajan Scientific and Medical', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 2, title: 'SGE Syringes, General Purpose Manual Syringe, PTFE Tipped Plunger, Trajan Scientific and Medical', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 3, title: 'Vacuum Traps, Dewar Type with Ace-Thred Inlet/Outlet, Ace Glass', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 4, title: 'SGE Syringes, General Purpose Manual Syringe, PTFE Tipped Plunger, Trajan Scientific and Medical', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 5, title: 'SGE Syringes, General Purpose Manual Syringe, PTFE Tipped Plunger, Trajan Scientific and Medical', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 6, title: 'SGE Syringes, General Purpose Manual Syringe, PTFE Tipped Plunger, Trajan Scientific and Medical', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 7, title: 'SGE Syringes, General Purpose Manual Syringe, PTFE Tipped Plunger, Trajan Scientific and Medical', imgsrc: 'https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
      ]
    }
  },
  async created() {
    
    console.log('created.');
    const typesense = new Typesense.Client({
      nodes: [
        {
          host: 'jcmib1wyvr5en7xap-1.a1.typesense.net',
          port: '443',
          protocol: 'https'
        }
      ],
      numRetries: 10,
      apiKey: 'kEMj84g6InUbtKwQ6gRSVpb8Vxn857Lw',
      connectionTimeoutSeconds: 10,
      retryIntervalSeconds: 0.1,
      healthcheckIntervalSeconds: 2,
      logLevel: 'debug'
    })

    try {
      // create a collection
      // await typesense.collections().create(schema)

      // Index documents
      // await Promise.all(
      //   documents.map((document) => {
      //     return typesense.collections('companies').documents().create(document)
      //   })
      // )

      // Search for documents
      let searchResults = []
      searchResults = await typesense.collections('companies').documents().search({
        q: 'Corp',
        query_by: 'company_name'
      })
      console.log(searchResults)
    } catch (error) {
      console.log(error)
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
    toggleEditDrawer(type, index) {
      if(type === 'condition') {
        this.editDrawerIndex = index;
        const editingItem = this.triggerData.query_conditions[index];
        this.editDrawerItem = {
          query: { option: editingItem.query.option, keyword: editingItem.query.keyword },
          filters: [...editingItem.filters]
          // filters: []
        };
      }
      else if(type === 'boost_category') {
        this.editDrawerItem = this.strategyData.boostCategories.map(item => item);
      }
      else if(type === 'bury_category') {
        this.editDrawerItem = this.strategyData.buryCategories;
      }
      else if(type === 'filter_results') {
        this.editDrawerItem = this.strategyData.filterResults;
      }
      this.addDrawerVisible = false;
      this.editDrawerType = type;
      this.editDrawerVisible = true;
    },

    editPeriod() {
      this.addDrawerVisible = false;
      this.editDrawerType = 'daterange';
      this.editDrawerItem = this.triggerData.period;
      this.editDrawerVisible = true;
    },
    addDrawerClose() {
      this.addDrawerVisible = false;
    },
    addDrawer(drawerType, drawerData) {
      if(drawerType === 'condition')
        this.triggerData.query_conditions = [...this.triggerData.query_conditions, drawerData];
      else if(drawerType === 'daterange')
        this.triggerData.period = drawerData;
      else if(drawerType === 'boost_category')
        this.strategyData.boostCategories = drawerData;
      else if(drawerType === 'bury_category')
        this.strategyData.buryCategories = drawerData;
      else if(drawerType === 'filter_results')
        this.strategyData.filterResults = drawerData;
      this.addDrawerVisible = false;
    },

    updateDrawerItem(editItem) {
      if(this.editDrawerType === 'condition') {
        this.triggerData.query_conditions = this.triggerData.query_conditions.map((item, index) => index === this.editDrawerIndex ? {
          query: { option: this.editDrawerItem.query.option, keyword: this.editDrawerItem.query.keyword },
          filters: this.editDrawerItem.filters
        }: item);
        this.editDrawerItem = {
          query: { option: 'contains', keyword: '' },
          filters: []
        };
      }
      else if(this.editDrawerType === 'daterange') {
        this.triggerData.period = editItem.slice();
        this.editDrawerItem = [];
      }
      else if(this.editDrawerType === 'boost_category') {
        this.strategyData.boostCategories = this.editDrawerItem.slice();
        this.editDrawerItem = [];
      }
      else if(this.editDrawerType === 'bury_category') {
        this.strategyData.buryCategories = this.editDrawerItem.slice();
        this.editDrawerItem = [];
      }
      else if(this.editDrawerType === 'filter_results') {
        this.strategyData.filterResults = this.editDrawerItem.slice();
        this.editDrawerItem = [];
      }
      this.editDrawerVisible = false;
    },
    editDrawerClose() {
      this.editDrawerVisible = false;
    },

    setItem(type, item) {
      if(type === 'period')
        this.editDrawerItem = item;
      else if(type === 'filters'){
        this.editDrawerItem.filters = item;
        }
      else if(type === 'boost_category')
        this.editDrawerItem = item;
      else if(type === 'bury_category')
        this.editDrawerItem = item;
      else if(type === 'filter_results')
        this.editDrawerItem = item;
    }
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