<template>
  <a-table :row-selection="rowSelection" :columns="columns" :data-source="rules" :bordered="bordered" :pagination="pagination" class="rules-table">
    <template slot="editor-column" slot-scope="editor">
      <div class="colored-badge">
        <a-icon type="layout" />
        &nbsp;{{editor}}
      </div>
    </template>
    <template slot="conditions-column" slot-scope="conditions">
      <div v-for="(condition, i) in conditions" :key="i" class="cond-wrapper">
        {{condition.type}}&nbsp;
        <div class="badge" v-if="condition.type === 'Between'">
          <a-icon type="calendar" />&nbsp;
          {{condition.value[0]}}&nbsp;
          <a-icon type="arrow-right" />&nbsp;
          {{condition.value[1]}}&nbsp;(UTC)
        </div>
        <div class="badge" v-else>
          {{condition.value}}
        </div>
        <div class="subtext" v-if="condition.type==='Query Contains'">
          <a-icon type="check-circle" />&nbsp;Apply to plurals, synonyms and typos.
        </div>
      </div>
    </template>

    <template slot="consequences-column" slot-scope="consequences">
      <div v-for="(consequence, i) in consequences" :key="i" class="cond-wrapper">
        <div v-for="(itemByCategory, itemByCategoryIndex) in consequence.value" :key="itemByCategoryIndex">
          <div v-if="consequence.type === 'Pin'" class="category-wrapper">
            <span style="margin-right: 4px">
              {{consequence.type}}
            </span>
            <div class="badge">
              <img :src="itemByCategory.img_url" class="pin-image"/>
              {{`${itemByCategory.id}_dashboard_generated_id`}}
            </div>
            <span style="margin: 0 4px">
            to position
            </span>
            <div class="badge">
              {{itemByCategoryIndex + 1}}
            </div>
          </div>
          <div v-else class="category-wrapper">
            <div v-for="(item, itemIndex) in itemByCategory" :key="itemIndex">
              <span v-if="itemIndex === 0">
                {{itemByCategoryIndex === 0 ? consequence.type : `and ${consequence.type}`}}
              </span>
              <span v-else style="margin-left: 4px">or</span>
              &nbsp;
              <div class="badge">
                {{getFilterLabel(item)}}
              </div>
            </div>
          </div>
          <div class="subtext" v-if="consequence.type ==='Pin' && itemByCategoryIndex === consequence.value.length - 1">
            <a-icon type="check-circle" />&nbsp;Pinned items must match active filters to be displayed.
          </div>
        </div>
      </div>
    </template>
  </a-table>
</template>

<script>
const columns = [
  {
    title: 'Editor',
    dataIndex: 'editor',
    key: 'editor',
    scopedSlots: { customRender: "editor-column" },
  },
  {
    title: 'Conditions',
    dataIndex: 'conditions',
    key: 'conditions',
    scopedSlots: { customRender: "conditions-column" },
  },
  {
    title: 'Consequences',
    dataIndex: 'consequences',
    key: 'consequences',
    scopedSlots: { customRender: "consequences-column" },
  },
  {
    title: 'Last Update',
    dataIndex: 'last_update',
  },
];
const rules = [
  {
    key: '1',
    editor: 'Visual',
    conditions: [
      {type: 'Between', value: ['Jan 19', 'Jan 21']},
      {type: 'Query Contains', value: 'iPhone'}
    ],
    consequences: [
      {type: 'Filter', value: [
        [
          {category: 'Color', operator: 'is', value: 'red'},
          {category: 'Size', operator: 'is', value: 'big'}
        ],
        [{category: 'Needle length', operator: 'greater_or_equal', value: '40'}]
      ]},
      {type: 'Boost', value: [
        [{category: 'Color', operator: 'is', value: 'red'}],
        [{category: 'Capacity', operator: 'is', value: 'large'}]
      ]},
      {type: 'Pin', value: [
        {id: 'feca8119448f2', img_url: 'https://user-content.algolia.com/SqCVtkPjPFeg8oGCfvYcN2Yd4qBypyNzNHIavYF2uJo/resizing_type:fit/width:16/height:16/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 'fa341fab8c7f5', img_url: 'https://user-content.algolia.com/SqCVtkPjPFeg8oGCfvYcN2Yd4qBypyNzNHIavYF2uJo/resizing_type:fit/width:16/height:16/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg'},
        {id: 'f4d29b3cee56b', img_url: 'https://user-content.algolia.com/_xwIAzMn4hTNdLORPd3Nysaw1MBz0do-DX-oECH0e1o/resizing_type:fit/width:16/height:16/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvMzgvOTUvOTkwMzg5NS5qcGc.jpg'}
      ]}
    ],
    last_update: 'Jan 20th, 03:57am'
  },
  {
    key: '2',
    editor: 'Manual',
    conditions: [
      {type: 'Query Contains', value: 'vacuum'}
    ],
    consequences: [
      {type: 'Filter', value: [
        [
          {category: 'Color', operator: 'is', value: 'red'},
          {category: 'Size', operator: 'is', value: 'big'}
        ],
        [{category: 'Needle length', operator: 'greater_or_equal', value: '40'}]
      ]}
    ],
    last_update: 'Jan 20th, 03:57am'
  },
];
export default {
  name: "RulesTable",
  data() {
    return {
      rules,
      columns,
      pagination: false,
      bordered: false,
      badgeStyle: {
        backgroundColor: 'rgb(232,250,255)',
        color: 'rgb(0,118,155)',
        borderColor: 'rgb(185,239,255)'
      }
    };
  },
  methods: {
    getFilterLabel(item) {
      let operator = '';
      switch (item.operator) {
        case 'equal':
          operator = '=';
          break;
        case 'not_equal':
          operator = '!=';
          break;
        case 'greater':
          operator = '>';
          break;
        case 'greater_or_equal':
          operator = '>=';
          break;
        case 'smaller':
          operator = '<';
          break;
        case 'smaller_or_equal':
          operator = '<=';
          break;
        default:
          operator = item.operator;
          break;
      }
      return `${item.category} ${operator} ${item.value}`;
    },
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
  },
}
</script>

<style scoped>
  .rules-table {
    border-top: 1px solid #e8e8e8;
  }

  .badge {
    padding: 0 8px;
    display: inline-block;
    border-radius: 100px;
    background-color: rgb(245,245,250);
    color: rgb(72,76,122);
    border: 1px solid rgb(214,214,231);
  }

  .colored-badge {
    padding: 0 8px;
    display: inline-block;
    border-radius: 100px;
    background-color: rgb(232,250,255);
    color: rgb(0,118,155);
    border: 1px solid rgb(185,239,255);
  }

  .cond-wrapper {
    margin: 8px 8px 0 0;
  }

  .subtext {
    color: #5a5e9a;
    font-size: 12px;
  }

  .category-wrapper {
    display: flex;
    flex-direction: row;
    margin-top: 8px;
  }

  .pin-image {
    width: 14px;
    height: 14px;
    border: 1px solid rgb(182,183,213);
    border-radius: 3px;
    margin-top: -1px;
  }
</style>
