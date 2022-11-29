<template>
  <h3>{{ "Ta'minotchi " + market?.name + " tarixi" }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <ul class="nav nav-pills nav-justified">
    <li class="nav-item">
      <button
        class="nav-link active"
        data-toggle="pill"
        @click="template = ''"
        @click.passive="template = 'supply'"
      >
        Olingan ta'minotlar tarixi
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        data-toggle="pill"
        @click="template = ''"
        @click.passive="template = 'payment'"
      >
        To'lovlar tarixi
      </button>
    </li>
  </ul>
  <div class="tab-content pt-2">
    <div v-if="template == 'supply'">
      <Supply @setloading="setloading" />
    </div>
    <div v-if="template == 'payment'">
      <Payments @setloading="setloading" />
    </div>
  </div>
</template>

<script>
import { catchError, market } from "@/components/Api/api";
import Supply from "./Ta'minotlar.vue";
import Payments from "./To'lovlar.vue";
export default {
  name: "Market",
  emits: ["setloading"],
  components: { Supply, Payments },
  data() {
    return {
      market: null,
      template: "",
    };
  },
  created() {
    this.getMarket();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getMarket() {
      market(this.$route.params.id)
        .then((Response) => {
          this.market = Response.data;
          this.template = "supply";
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>
