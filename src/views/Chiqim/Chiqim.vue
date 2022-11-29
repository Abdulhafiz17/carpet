<template>
  <h3>Chiqim</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <div class="btn-group btn-group-sm">
        <button
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#chiqimlar"
          get-fixed-expenses
        >
          <i class="fa fa-bars" />
        </button>
        <button
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#doimiy"
          fixed-expense
        >
          <i class="fa fa-coins" /> Doimiy
        </button>
        <button
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#bir-marttalik"
          variable-expense
        >
          <i class="fa fa-coins" /> Bir marttalik
        </button>
      </div>
    </div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <ul class="nav nav-pills nav-justified">
    <li class="nav-item">
      <button
        class="nav-link"
        :class="template == 'doimiy' ? 'active' : ''"
        @click="setTemplate('doimiy')"
      >
        Doimiy chiqimlar
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        :class="template == 'bir_marttalik' ? 'active' : ''"
        @click="setTemplate('bir_marttalik')"
      >
        Bir marttalik chiqimlar
      </button>
    </li>
  </ul>

  <div class="tab-content pt-2">
    <div v-if="template == 'doimiy'">
      <Doimiy :fixed_expenses="expenses" @setloading="setloading" />
    </div>
    <div v-if="template == 'bir_marttalik'">
      <BirMarttalik @setloading="setloading" />
    </div>
  </div>

  <ModalChiqimlar
    :fixed_expenses="expenses"
    @setloading="setloading"
    @getExpenses="getExpenses"
    @setTemplate="setTemplate"
  />
</template>

<script>
import ModalChiqimlar from "./ModalChiqimlar.vue";
import Doimiy from "./ChiqimlarDoimiy.vue";
import BirMarttalik from "./ChiqimlarBirMarttalik.vue";
import { catchError, getFixedExpenses } from "@/components/Api/api";
export default {
  name: "Expense",
  emits: ["setloading"],
  components: { ModalChiqimlar, Doimiy, BirMarttalik },
  data() {
    return {
      template: "",
      expenses: [],
    };
  },
  created() {
    this.template = "doimiy";
    this.getExpenses();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    setTemplate(template) {
      this.template = "";
      setTimeout(() => {
        this.template = template;
      }, 1);
    },
    getExpenses(mounted) {
      getFixedExpenses()
        .then((Response) => {
          this.expenses = Response.data;
          mounted ? this.$emit("setloading", false) : false;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>
