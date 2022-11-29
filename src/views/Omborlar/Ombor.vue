<template>
  <h3>{{ "Ombor " + warehouse?.name }}</h3>
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
        warehouse-products
        @click="
          template = 'products';
          $emit('setloading', true);
        "
      >
        Ombor mahsulotlari
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        data-toggle="pill"
        send-product
        @click="
          template = 'send-product';
          $emit('setloading', true);
        "
      >
        Filialga mahsulot yuborish
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        data-toggle="pill"
        @click="
          template = 'transfers';
          $emit('setloading', true);
        "
      >
        Filialga yuborilgan mahsulotlar
      </button>
    </li>
  </ul>

  <div class="tab-content pt-2">
    <div v-if="template == 'products'">
      <Products @setloading="setloading" />
    </div>
    <div v-if="template == 'send-product'">
      <Transfer @setloading="setloading" />
    </div>
    <div v-if="template == 'transfers'">
      <Transfers @setloading="setloading" />
    </div>
  </div>
</template>

<script>
import { catchError, warehouse } from "@/components/Api/api";
import Products from "./Mahsulotlar.vue";
import Transfer from "./MahsulotYuborish.vue";
import Transfers from "./YuborilganMahsulotlar.vue";
export default {
  name: "Ombor",
  emits: ["setloading"],
  components: { Products, Transfer, Transfers },
  data() {
    return {
      id: this.$route.params.id,
      warehouse: null,
      template: "",
    };
  },
  created() {
    this.getWarehouse();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getWarehouse() {
      warehouse(this.id)
        .then((Response) => {
          this.warehouse = Response.data;
          this.template = "products";
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>
