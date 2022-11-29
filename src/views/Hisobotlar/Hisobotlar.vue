<template>
  <h3>Hisobotlar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />
</template>

<script>
export default {
  name: "Hiobotlar",
  emits: ["setloading"],
  created() {
    this.$emit("setloading", false);
  },
};
</script>
