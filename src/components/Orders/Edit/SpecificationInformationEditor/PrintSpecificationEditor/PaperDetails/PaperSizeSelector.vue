<template>
  <div class="page-size-selector-wrapper">
    <inline-validation-errors
      :conditions="[{ field: 'section_name', value: sectionName }]"
      id="paper-finished-page-size"
    ></inline-validation-errors>
    <div class="page-size-selector">
      <div class="paper-selector" :class="{ 'has-selection': selected }">
        <div class="paper-background a0"></div>
        <div @click.prevent="selectSize('a0')" class="paper a0" :class="{ selected: isSizeSelected('a0') }"></div>
        <div class="paper-size-label a0" :class="{ selected: isSizeSelected('a0') }">A0</div>

        <div class="paper-background a1"></div>
        <div @click.prevent="selectSize('a1')" class="paper a1" :class="{ selected: isSizeSelected('a1') }"></div>
        <div class="paper-size-label a1" :class="{ selected: isSizeSelected('a1') }">A1</div>

        <div class="paper-background a2"></div>
        <div @click.prevent="selectSize('a2')" class="paper a2" :class="{ selected: isSizeSelected('a2') }"></div>
        <div class="paper-size-label a2" :class="{ selected: isSizeSelected('a2') }">A2</div>

        <div class="paper-background a3"></div>
        <div @click.prevent="selectSize('a3')" class="paper a3" :class="{ selected: isSizeSelected('a3') }"></div>
        <div class="paper-size-label a3" :class="{ selected: isSizeSelected('a3') }">A3</div>

        <div class="paper-background a4"></div>
        <div @click.prevent="selectSize('a4')" class="paper a4" :class="{ selected: isSizeSelected('a4') }"></div>
        <div class="paper-size-label a4" :class="{ selected: isSizeSelected('a4') }">A4</div>

        <div class="paper-background a5"></div>
        <div @click.prevent="selectSize('a5')" class="paper a5" :class="{ selected: isSizeSelected('a5') }"></div>
        <div class="paper-size-label a5" :class="{ selected: isSizeSelected('a5') }">A5</div>

        <div class="paper-background a6"></div>
        <div @click.prevent="selectSize('a6')" class="paper a6" :class="{ selected: isSizeSelected('a6') }"></div>
        <div class="paper-size-label a6" :class="{ selected: isSizeSelected('a6') }">A6</div>

        <!--        <div class="paper a7">-->
        <!--            <div class="paper-size-label">A7</div>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaperSizeSelector",
  props: ["initialSize", "sectionName"],
  data() {
    return {
      selected: this.initialSize,
    };
  },
  methods: {
    selectSize(size) {
      if (this.selected === size) {
        this.selected = null;
      } else {
        this.selected = size;
      }
    },

    isSizeSelected(size) {
      return this.selected === size;
    },
  },
  watch: {
    selected(newSelected) {
      this.$emit("paper-size-selected", newSelected);
    },
  },
};
</script>

<style scoped lang="scss">
$scaling: 0.43;

.page-size-selector {
  margin: 0 auto;
  width: 841px * $scaling;
  height: 1189px * $scaling;
  position: relative;
}

.paper-selector {
  margin-top: 10px;

  width: 841px * $scaling;
  height: 1189px * $scaling;
  position: relative;

  .paper-background {
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;

    &.a0 {
      width: 841px * $scaling;
      height: 1189px * $scaling;
    }

    &.a1 {
      width: 594px * $scaling;
      height: 841px * $scaling;
    }

    &.a2 {
      width: 420px * $scaling;
      height: 594px * $scaling;
    }

    &.a3 {
      width: 297px * $scaling;
      height: 420px * $scaling;
    }

    &.a4 {
      width: 210px * $scaling;
      height: 297px * $scaling;
    }

    &.a5 {
      width: 148px * $scaling;
      height: 210px * $scaling;
    }

    &.a6 {
      width: 105px * $scaling;
      height: 148px * $scaling;
    }

    &.a7 {
      width: 74px * $scaling;
      height: 105px * $scaling;
    }
  }

  &.has-selection {
    .paper {
      opacity: 0.3;
    }
  }

  .paper {
    position: absolute;
    bottom: 0;
    left: 0;

    opacity: 0.8;

    &:hover,
    &.selected {
      border: 2px solid #fff;
      border-left-width: 0;
      border-bottom-width: 0;
      cursor: pointer;
    }

    &.selected {
      opacity: 1;
      /*z-index: 1000;*/
    }

    &.a0 {
      width: 841px * $scaling;
      height: 1189px * $scaling;
      background: #d4302a;
    }

    &.a1 {
      width: 594px * $scaling;
      height: 841px * $scaling;
      background: #de6d35;
    }

    &.a2 {
      width: 420px * $scaling;
      height: 594px * $scaling;
      background: #efc84f;
    }

    &.a3 {
      width: 297px * $scaling;
      height: 420px * $scaling;
      background: #a0c052;
    }

    &.a4 {
      width: 210px * $scaling;
      height: 297px * $scaling;
      background: #2a6339;
    }

    &.a5 {
      width: 148px * $scaling;
      height: 210px * $scaling;
      background: #55bae8;
    }

    &.a6 {
      width: 105px * $scaling;
      height: 148px * $scaling;
      background: #1c2750;
    }

    &.a7 {
      width: 74px * $scaling;
      height: 105px * $scaling;
      background: #7f3483;
    }
  }

  .paper-size-label {
    color: #fff;
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    left: 5px;

    &.selected {
      /*z-index: 1001;*/
    }

    &.a0 {
      top: 0;
    }

    &.a1 {
      top: 348px * $scaling;
    }

    &.a2 {
      top: 595px * $scaling;
    }

    &.a3 {
      top: 769px * $scaling;
    }

    &.a4 {
      top: 892px * $scaling;
    }

    &.a5 {
      top: 979px * $scaling;
    }

    &.a6 {
      top: 1041px * $scaling;
    }
  }

  .paper-background.a0 {
    z-index: 500;
  }
  .paper.a0 {
    z-index: 501;
  }
  .paper-size-label.a0 {
    z-index: 502;
  }

  .paper-background.a1 {
    z-index: 503;
  }
  .paper.a1 {
    z-index: 504;
  }
  .paper-size-label.a1 {
    z-index: 505;
  }

  .paper-background.a2 {
    z-index: 506;
  }
  .paper.a2 {
    z-index: 507;
  }
  .paper-size-label.a2 {
    z-index: 508;
  }

  .paper-background.a3 {
    z-index: 509;
  }
  .paper.a3 {
    z-index: 510;
  }
  .paper-size-label.a3 {
    z-index: 511;
  }

  .paper-background.a4 {
    z-index: 512;
  }
  .paper.a4 {
    z-index: 513;
  }
  .paper-size-label.a4 {
    z-index: 514;
  }

  .paper-background.a5 {
    z-index: 515;
  }
  .paper.a5 {
    z-index: 516;
  }
  .paper-size-label.a5 {
    z-index: 517;
  }

  .paper-background.a6 {
    z-index: 518;
  }
  .paper.a6 {
    z-index: 519;
  }
  .paper-size-label.a6 {
    z-index: 520;
  }

  .paper.selected {
    z-index: 1000;
  }

  .paper-size-label.selected {
    z-index: 1001;
  }
}
</style>
