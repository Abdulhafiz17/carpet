<template>
  <h3>{{ "Ta'minot id: " + $route.params.id }}</h3>
  <div class="row">
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-outline-primary"
        data-toggle="modal"
        data-target="#addMarket"
        v-if="supply_status == 'false'"
      >
        <i class="fa fa-plus" /> Ta'minotchi qo'shish
      </button>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-outline-success"
        data-toggle="modal"
        data-target="#confirm"
        @click="getCurrencies()"
        v-if="supply_status == 'false'"
      >
        <i class="far fa-circle-check" /> Ta'minotni yakunlash
      </button>
    </div>
  </div>
  <hr />

  <tabs
    :tab_buttons="[`Mahsulotlar`, `Xarajatlar`]"
    :tab_slots="[`products`, `expenses`]"
  >
    <template #products>
      <Products @setloading="setloading" @getBalance="getBalance" />
    </template>
    <template #expenses>
      <Expenses @setloading="setloading" @getBalance="getBalance" />
    </template>
  </tabs>

  <div class="modal fade" id="addMarket">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Ta'minotchi qo'shish</h4>
        </div>
        <form @submit.prevent="addMarket(new_market)">
          <div class="modal-body">
            <div class="row gap-2 text-left">
              <label class="col-md-12">
                Ism
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="new_market.name"
                />
              </label>
              <label class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-text">+</div>
                  <input
                    type="tel"
                    minlength="9"
                    class="form-control"
                    required
                    v-model="new_market.phone"
                  />
                </div>
              </label>
              <label class="col-md-12">
                Manzil
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="new_market.address"
                />
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-add-market
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="confirm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Ta'minotni yakunlash</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-2 text-left">
            <form @submit.prevent="confirmParty()" id="form">
              <label class="col-md-12">
                Xarajatlarni yaxlitlash uchun valyuta tanlang
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="currency_id"
                >
                  <option value="">valyuta</option>
                  <option
                    v-for="item in currencies"
                    :key="item"
                    :value="item.id"
                  >
                    {{ item.currency }}
                  </option>
                </select>
              </label>
            </form>
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-6">
                  <button
                    class="btn btn-sm btn-block"
                    :class="to_branch ? 'btn-outline-primary' : 'btn-primary'"
                    @click="to_branch = false"
                  >
                    <i class="fa fa-warehouse" /> Omborga yuborish
                  </button>
                </div>
                <div class="col-md-6">
                  <button
                    class="btn btn-sm btn-block"
                    :class="to_branch ? 'btn-primary' : 'btn-outline-primary'"
                    @click="to_branch = true"
                  >
                    <i class="fa fa-code-branch" /> Filialga yuborish
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-12" v-if="!to_branch">
              <p class="text-center">
                <strong>Omborlar</strong>
              </p>
              <ul class="list-group responsive-y" style="max-height: 40vh">
                <button
                  form="form"
                  class="list-group-item"
                  v-for="item in warehouses"
                  :key="item"
                  @click="warehouse_id = item.id"
                >
                  {{ item.name }}
                </button>
              </ul>
            </div>
            <div class="col-md-12" v-if="to_branch">
              <p class="text-center">
                <strong>Filiallar</strong>
              </p>
              <ul class="list-group responsive-y" style="max-height: 40vh">
                <button
                  form="form"
                  class="list-group-item"
                  v-for="item in branches"
                  :key="item"
                  @click="warehouse_id = item.Branches.id"
                >
                  {{ item.Branches.name }}
                </button>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-confirm-party
          >
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  branches,
  catchError,
  confirmationParty,
  createMarket,
  currencies,
  partyBalance,
  success,
  warehouses,
} from "@/components/Api/api";
import Products from "./Ta'minotMahsulotlari.vue";
import Expenses from "./Ta'minotChiqimlari.vue";
export default {
  name: "Ta'minot",
  emits: ["setloading"],
  components: { Products, Expenses },
  data() {
    return {
      _: Intl.NumberFormat(),
      supply_status: localStorage.getItem("supply_status"),
      total_price: [],
      total_expense: [],
      new_market: {
        name: null,
        phone: null,
        address: null,
      },
      currencies: [],
      currency_id: "",
      to_branch: false,
      warehouses: [],
      branches: [],
      warehouse_id: null,
    };
  },
  created() {
    this.getBalance();
  },
  mounted() {
    document.querySelector("[name=products]", "name=expenses").onclick = () => {
      this.$emit("setloading", true);
    };
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getBalance(template) {
      partyBalance(this.$route.params.id)
        .then((Response) => {
          this.total_price = Response.data.total_price;
          this.total_expense = Response.data.total_expence_price;
          if (template) {
            this.$emit("setloading", false);
          } else {
            this.template = "products";
          }
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCurrencies() {
      currencies()
        .then((Response) => {
          this.currencies = Response.data;
          this.getWarehouses();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getWarehouses() {
      warehouses()
        .then((Response) => {
          this.warehouses = Response.data;
          this.getBranches();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBranches() {
      branches()
        .then((Response) => {
          this.branches = Response.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    addMarket(market) {
      this.$emit("setloading", true);
      createMarket(market)
        .then((Response) => {
          success("close-add-market").then(() => {
            this.new_market = {
              name: null,
              phone: null,
              address: null,
            };
            this.$emit("setloading", false);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    confirmParty() {
      confirmationParty(
        this.$route.params.id,
        this.warehouse_id,
        this.currency_id,
        this.to_branch
      )
        .then((Response) => {
          success("close-confirm-party").then(() => {
            this.$router.push("/taminotlar");
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>
