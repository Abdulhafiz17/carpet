<template>
  <div class="details">
    <button class="details-header" @click="toggleDetails($event)">
      <slot name="header" />
      <span>
        <i :class="`fa fa-lg fa-${icon}`" />
      </span>
    </button>
    <div class="details-body">
      <slot name="body" />
    </div>
  </div>
</template>

<script>
export default {
  name: "collapse",
  data() {
    return {
      icon: "plus",
    };
  },
  methods: {
    toggleDetails(event) {
      let details = event.target.parentNode;
      let open = details.classList.contains("open");
      if (open) {
        this.icon = "plus";
        details.classList.remove("open");
      } else {
        this.icon = "minus";
        details.classList.add("open");
      }
    },
  },
};
</script>

<style scoped>
.details {
  margin: 3px 0;
  border-radius: 4px;
  /* transition: 0.5s all; */
}

.dark .details {
  background: rgb(50, 55, 65);
}

.details .details {
  margin: 0;
  padding: 0;
  background: none;
}

.details .details-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
  border: none;
  border-radius: 4px;
  color: whitesmoke;
  background: rgb(13, 110, 253);
}

.details .details-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.details .details-body {
  height: 0;
  opacity: 0;
  transform: scale(0);
  transform-origin: top;
  transition: 0.2s all;
}

.details.open > .details-body {
  height: auto;
  margin-top: 5px;
  padding: 10px;
  border: 1px solid rgb(13, 110, 253);
  border-radius: 4px;
  opacity: 1;
  transform: scale(1);
}
</style>
