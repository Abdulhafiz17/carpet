<template></template>

<script>
export default {
  name: "Home",
  emits: ["setloading"],
  data() {
    return {
      role: localStorage.getItem("role")
    }
  },
  created() {
    if (this.role == "admin") {
      this.$router.push("/filiallar")
    } else if (this.role == "branch_admin") {
      this.$router.push("/kassa")
    }
  },
};
</script>