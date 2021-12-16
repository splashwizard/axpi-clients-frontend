<template>
  <a-modal
      @ok="attemptSaveMaterial"
      title="Add Material"
      v-model="showModal"
      :confirm-loading="isSaving">
    <a-form layout="vertical">
      <a-form-item label="Aspect">
        <a-select v-model="form.aspect"
                  show-search size="large">
          <a-select-option v-for="option in aspectOptions"
                           :key="option"
                           :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Material">
        <a-select v-model="form.material"
                  show-search size="large">
          <a-select-option v-for="option in materialOptions"
                           :key="option"
                           :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Weight">
        <a-input-group style="width: 100%;" compact>
          <a-input size="large" v-model="form.weight" style="width: calc(100% - 150px)"/>
          <a-select size="large" style="width:150px" v-model="form.weight_unit">
            <a-select-option value="kg">
              kg
            </a-select-option>
            <a-select-option value="lb">
              lb
            </a-select-option>
          </a-select>
        </a-input-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import axios from 'axios';
export default {
  name: "AddMaterialModal",
  props: ['visible', 'productId'],
  data() {
    return {
      isSaving: false,

      form: {
        aspect: null,
        material: null,
        weight: null,
        weight_unit: 'kg'
      },

      aspectOptions: ['Aspect 1', 'Aspect 2', 'Aspect 3', 'Aspect 4'],
      materialOptions: ['Material 1', 'Material 2', 'Material 3', 'Material 4']
    }
  },
  computed: {
    showModal: {
      get() {
        return this.visible;
      },
      set(val) {
        if (!val) {
          this.closeModal();
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },

    resetForm() {
      this.form = {
        aspect: null,
        material: null,
        weight: null,
        weight_unit: 'kg'
      };
    },

    attemptSaveMaterial() {
      let vm = this;
      vm.isSaving = true;

      axios.post(window.API_BASE + '/products/' + this.productId + '/esg/materials', this.form).then(() => {
        vm.isSaving = false;
        vm.resetForm();
        vm.$emit('material-added');
      }).catch(e => {
        console.log(e);
        vm.isSaving = false;
        vm.$message.error('Error saving material');
      });
    }
  }
}
</script>

<style scoped>

</style>