<template>
  <h3>Ta'minot</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <tabs
    :tab_buttons="[`Faol ta'minotlar`, `Yakunlangan ta'minotlar`]"
    :tab_slots="[`active`, `closed`]"
  >
    <template #active>
      <Active @setloading="setloading" />
    </template>
    <template #closed>
      <Closed @setloading="setloading" />
    </template>
  </tabs>
</template>

<script>
import Active from "./FaolTa'minotlar.vue";
import Closed from "./YakunlanganTa'minotlar.vue";
export default {
  name: "Ta'minot",
  emits: ["setloading"],
  components: { Active, Closed },
  data() {
    return {};
  },
  created() {},
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
  },
};
</script>
