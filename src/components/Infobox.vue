<template>
  <a-popover trigger="click" v-if="fieldDetails && numberOfStages >= 1">
    <template slot="title">
      <div class="infobox-header" v-if="numberOfStages > 1">
        <div class="left">
          <a-button @click.prevent="goToPreviousStage" :disabled="!canGoLeft" size="small" icon="left"/>
        </div>
        <div class="center">
          {{ currentStageTitle }}
        </div>
        <div class="right">
          <a-button @click.prevent="goToNextStage" :disabled="!canGoRight" size="small" icon="right"/>
        </div>
      </div>
    </template>
    <template slot="content">
      <div class="infobox-center">
        {{ currentStageText }}
      </div>
    </template>
    <div class="infobox-btn">
      <a-button size="small" shape="circle" icon="question"/>
    </div>
  </a-popover>
</template>

<script>
import {fields} from "../../configs/infoboxes.json";

const _ = require('lodash');

export default {
  name: "Infobox",
  props: ['id'],
  data() {
    return {
      stage: 1
    }
  },
  methods: {
    goToNextStage() {
      this.stage += 1;
    },

    goToPreviousStage() {
      this.stage -= 1;
    }
  },
  computed: {
    canGoLeft() {
      return (this.stage > 1);
    },

    canGoRight() {
      return (this.stage < this.numberOfStages);
    },

    fieldDetails() {
      return _.find(fields, {
        "Field": this.id
      });
    },

    numberOfStages() {
      if (this.fieldDetails) {
        let number = 0;
        _.each([1, 2, 3, 4, 5, 6, 7, 8, 9], stage => {
          if (this.fieldDetails['Help Section ' + stage + ' Text']) {
            number = stage;
          }
        });
        return number;
      }
      return 0;
    },

    currentStageTitle() {
      if (this.fieldDetails) {
        return this.fieldDetails['Help Section ' + this.stage + ' Title'];
      }
      return null;
    },

    currentStageText() {
      if (this.fieldDetails) {
        return this.fieldDetails['Help Section ' + this.stage + ' Text'];
      }
      return null;
    }
  }
}
</script>

<style>
.ant-popover-title {
  padding-left: 4px !important;
  padding-right: 4px !important;
}

.infobox-btn {
  display: inline;
}

.infobox-btn .ant-btn {
  width: 23px;
  height: 23px;
}

.infobox-btn .ant-btn i {
  font-size: 12px;
}

.infobox-header {
  display: flex;
}

.infobox-header .left, .infobox-header .right {
  flex-shrink: 1;
}

.infobox-header .center {
  flex: 1;
  text-align: center;
}

.infobox-center {
  max-width: 300px;
}
</style>