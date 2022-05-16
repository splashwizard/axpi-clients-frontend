<template>
  <a-layout>
    <left-sidebar></left-sidebar>
    <a-layout style="padding: 7px 30px">
      <h1 class="page-title">My Attributes</h1>
      <div class="tree-container">
        <div class="card">
          <div class="card-header">
            <h4>My Attributes</h4>
          </div>
          <div class="card-body">
            <el-tree
              :data="treeData1"
              ref="tree1"
              class="tree"
              node-key="id"
              draggable
              default-expand-all
              :allow-drop="returnFalse"
              @node-drag-start="handleDragstart"
              @node-drag-end="handleDragend"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <a-icon
                  v-if="data.type"
                  :type="data.type === 'custom' ? 'shop' : 'shopping'"
                  :style="{ paddingRight: '4px' }"
                />
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="card ml-2">
          <div class="card-header">
            <h4>Shop Attributes</h4>
          </div>
          <div class="card-body">
            <el-tree
              :data="treeData2"
              ref="tree2"
              class="tree"
              node-key="id"
              draggable
              default-expand-all
              :allow-drop="returnTrue"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <a-icon
                  v-if="data.type"
                  :type="data.type === 'custom' ? 'shop' : 'shopping'"
                  :style="{ paddingRight: '4px' }"
                />
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </a-layout>
  </a-layout>
</template>

<script>
import LeftSidebar from "./LeftSidebar";

export default {
  name: "ProductAttributes",
  components: { LeftSidebar },
  data() {
    return {
      treeData1: [
        {
          id: 1,
          label: "Category 1",
          children: [
            {
              id: 2,
              label: "Attribute 1",
              type: "custom",
            },
            {
              id: 3,
              label: "Attribute 2",
              type: "custom",
            },
          ],
        },
        {
          id: 4,
          label: "Category 2",
          children: [
            {
              id: 5,
              label: "Attribute 3",
              type: "custom",
            },
            {
              id: 6,
              label: "Attribute 4",
              type: "custom",
            },
          ],
        },
      ],
      treeData2: [
        {
          id: 2,
          label: "Attribute 2",
          children: [
            {
              id: 6,
              label: "Shop Attribute 1",
              type: "shop",
            },
            {
              id: 7,
              label: "Shop Attribute 2",
              type: "shop",
            },
            {
              id: 8,
              label: "Shop Attribute 3",
              type: "shop",
            },
            {
              id: 9,
              label: "Shop Attribute 4",
              type: "shop",
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleDragstart(node, event) {
      this.$refs.tree2.$emit("tree-node-drag-start", event, { node: node });
    },
    handleDragend(draggingNode, endNode, position, event) {
      let emptyData = { id: +new Date(), children: [] };
      // this.$refs.tree1.insertBefore(emptyData, draggingNode);

      this.$refs.tree2.$emit("tree-node-drag-end", event);
      this.$nextTick(() => {
        if (this.$refs.tree1.getNode(draggingNode.data)) {
          this.$refs.tree1.remove(emptyData);
        } else {
          // let data = JSON.parse(JSON.stringify(draggingNode.data));
          // this.$refs.tree1.insertAfter(data, this.$refs.tree1.getNode(emptyData));
          this.$refs.tree1.remove(this.$refs.tree1.getNode(emptyData));
        }
      });
    },
    returnTrue() {
      return true;
    },
    returnFalse() {
      return false;
    },
  },
  created() {},
};
</script>

<style scoped>
.page-title {
  padding-bottom: 16px;
}
.tree-container {
  display: flex;
}

.tree {
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
  width: 100%;
}

.card {
  border: 2px solid lightgray;
  border-radius: 10px;
  width: 40%;
  overflow: hidden;
}

.card-header {
  background-color: rgb(184, 247, 237);
  padding: 8px 16px;
  border-bottom: 2px solid lightgray;
}

.card-body {
  padding: 16px;
}

.ml-2 {
  margin-left: 8px;
}
</style>
