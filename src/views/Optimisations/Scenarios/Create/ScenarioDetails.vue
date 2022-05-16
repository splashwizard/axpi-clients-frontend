<template>
  <div class="form-section">
    <div class="form-header">
      <h2>Scenario Details</h2>
    </div>

    <a-form layout="vertical">
      <a-row :gutter="50">
        <a-col :span="12">
          <a-form-item label="Name">
            <a-input size="large" v-model="scenario.name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Tags">
            <a-select mode="multiple" v-model="scenario.tags" size="large">
              <a-select-option v-for="tag in possibleTags" :value="tag" :key="tag">
                {{ tag }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="Description">
        <a-textarea v-model="scenario.description" :rows="4" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "ScenarioDetails",
  props: ["scenario"],
  data() {
    return {
      possibleTags: ["Environmental", "Social Responsibility", "Cost"],
    };
  },
};
</script>

<style scoped></style>
