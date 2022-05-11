<template>
  <div class="root" v-if="visible">
    <div
      class="title-box"
      :class="{ 'has-refined': hasRefined }"
      @mouseenter="showOptionsNumber"
      @mouseleave="hideOptionsNumber"
      @click="toggleOptions"
    >
      <div class="options-title-wrapper">
        <span class="options-title">{{ title }}</span>
        <span class="options-count" v-if="options.length && visibleOptionsNumber && !hasRefined">
          {{ options.length }} options
        </span>
        <span class="options-count" v-else-if="hasRefined">{{ isRefinedNumber }} selected</span>
      </div>
      <div>
        <a-icon type="caret-right" v-if="isCollapsed" key="i-arrow-right" />
        <a-icon type="caret-down" v-else key="i-arrow-down" />
      </div>
    </div>
    <div class="options" v-if="!isCollapsed">
      <div class="option-search-input-wrapper">
        <input
          class="option-search-input"
          @input="searchForItems($event.currentTarget.value)"
          placeholder="Search..."
          :value="optionQuery"
        />
      </div>
      <ul class="options-list">
        <li class="option-item" v-if="!options.length" key="no-result">No results.</li>
        <li
          class="option-item"
          :class="{ 'is-refined': option.isRefined }"
          v-for="option in options"
          :key="option.value"
          @click="search(option.value)"
        >
          <div class="option">
            <span v-html="option.label" />
            <span class="count-number">{{ option.count }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "FilterOptions",
  props: {
    items: {
      type: Array,
      required: true,
    },
    refine: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      orgOptions: [],
      optionQuery: "",
      options: [],
      visibleOptionsNumber: false,
      isCollapsed: true,
      hasRefined: false,
      isRefinedNumber: 0,
      visible: false,
    };
  },
  watch: {
    items: function (val) {
      if (val && val.length) {
        this.getOptions();
      }
    },
    orgOptions: function (val) {
      if (val && val.length) {
        this.visible = true;
        return;
      }

      this.visible = false;
    },
  },
  methods: {
    getOptions() {
      let values = [];
      if (this.items.filter((item) => item.isRefined).length) {
        this.isRefinedNumber = this.items.filter((item) => item.isRefined).length;
        this.hasRefined = true;
      } else {
        this.isRefinedNumber = 0;
        this.hasRefined = false;
      }

      for (const iterator of this.items) {
        values.push(iterator);
      }

      this.orgOptions = _.uniq(values);
      this.options = _.uniq(values);
    },

    searchForItems(value) {
      this.optionQuery = value;

      if (value === "") {
        this.options = this.orgOptions;
        return;
      }

      this.options = this.orgOptions.filter((option) => {
        return option.label.toLowerCase().includes(value.toLowerCase());
      });
    },

    showOptionsNumber() {
      this.visibleOptionsNumber = true;
    },

    hideOptionsNumber() {
      this.visibleOptionsNumber = false;
    },

    toggleOptions() {
      this.isCollapsed = !this.isCollapsed;
    },

    search(val) {
      this.optionQuery = "";
      this.refine(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  border: 1px solid #eaeaea;
  margin-bottom: 1rem;
  user-select: none;
}

.title-box {
  padding: 1rem;
  font-size: 14px;
  font-weight: 500;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .options-title-wrapper {
    display: flex;
    flex-wrap: wrap;

    .options-title {
      text-transform: capitalize;
      margin-right: 1rem;
      font-size: 15px;
    }

    .options-count {
      color: #188fff;
      font-size: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      background-color: #188fff1a;
    }
  }

  &.has-refined {
    color: #188fff;
  }
}

.options {
  border-top: 1px solid #eaeaea;

  .option-search-input-wrapper {
    width: 100%;
    padding: 1rem;

    .option-search-input {
      width: 100%;
      height: 32px;
      padding: 0 12px;
      border: 1px solid #eaeaea;

      &::placeholder {
        color: #b2b2b2;
      }

      &:focus {
        outline: none;
        border-color: #188fff;
      }
    }
  }

  .options-list {
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    list-style: none;
    margin: 0;
    padding: 0;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #eaeaea;
      cursor: pointer;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #bcbcbc;
      border-radius: 10px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #424242;
    }

    .option-item {
      padding: 8px 1rem;
      margin-bottom: 2px;

      &.is-refined {
        background-color: #188fff11;
        color: #188fff;

        .option .count-number {
          background-color: #188fff35;
          color: #0479e7;
        }

        &:hover {
          background-color: #188fff11;
        }
      }

      &:hover {
        background-color: #f5f5f5;
      }

      .option {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .count-number {
          width: 24px;
          height: 24px;
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background-color: #e7e7e7;
          font-size: 10px;
          color: #9a9a9a;
        }
      }
    }
  }
}
</style>
