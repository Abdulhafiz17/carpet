<template>
  <div class="row my-1">
    <div class="col-md-5 mx-auto">
      <form @submit.prevent="postTrade(barcode)">
        <input
          type="text"
          class="form-control form-control-sm text-center"
          placeholder="code"
          list="products"
          barcode
          :disabled="!order"
          v-model="barcode"
          @keyup="barcode ? getProducts() : (products = [])"
          @focusout="
            barcode = null;
            products = [];
          "
        />
        <datalist id="products">
          <option
            v-for="item in products"
            :key="item"
            :value="item.Products.code"
          >
            {{
              item.name +
              " - " +
              item.Products.articul +
              " - " +
              item.Products.eni +
              (item.Products.boyi ? " x " + item.Products.boyi : " metr")
            }}
          </option>
        </datalist>
      </form>
    </div>
  </div>
  <div class="responsive-y" style="height: 72vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>№</th>
          <th>Mahsulot</th>
          <th style="width: 20%">Hajm</th>
          <th>Narx</th>
          <th>Chegirma</th>
          <th>To'lov</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in trades" :key="item">
          <td>{{ index + 1 }}</td>
          <td>
            {{
              item.Categories.name +
              " - " +
              item.Products.articul +
              " - " +
              item.Products.eni +
              (item.Products.boyi ? " x " + item.Products.boyi : " metr")
            }}
          </td>
          <td>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <button
                  class="btn btn-outline-primary"
                  @click="putTradeQuantity(item, '-')"
                >
                  <i class="fa fa-minus" />
                </button>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                class="form-control text-center"
                required
                readonly
                v-model="item.sum_quantity"
              />
              <div class="input-group-text">
                {{ item.Products.boyi ? " dona" : " metr" }}
              </div>
              <div class="input-group-append">
                <button
                  class="btn btn-outline-primary"
                  @click="putTradeQuantity(item, '+')"
                >
                  <i class="fa fa-plus" />
                </button>
              </div>
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input
                type="number"
                min="0"
                step="any"
                class="form-control text-center"
                required
                v-model="item.Trades.price"
                @focusout="putTrade(item)"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input
                type="number"
                min="0"
                step="any"
                class="form-control text-center"
                required
                v-model="item.Trades.discount"
                @focusout="putTrade(item)"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </td>
          <td>
            {{ _.format(item.Trades.price - item.Trades.discount) + " so'm" }}
          </td>
          <td>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteTrade(item)"
            >
              <i class="fa fa-trash" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  catchError,
  productsForTrade,
  success,
  toTrade,
  trades,
  updateTrade,
} from "@/components/Api/api";
import swal from "sweetalert";
export default {
  name: "Products",
  props: ["current_order"],
  emits: ["setloading", "getOrderBalance"],
  data() {
    return {
      _: Intl.NumberFormat(),
      barcode: null,
      products: [],
      trades: [],
    };
  },
  computed: {
    order() {
      return this.$props.current_order;
    },
  },
  watch: {
    order(order) {
      if (order) {
        this.getTrades();
      } else {
        this.trades = [];
      }
    },
  },
  created() {
    if (this.order) {
      this.getTrades();
    } else {
      this.trades = [];
    }
  },
  methods: {
    getProducts() {
      productsForTrade(this.barcode)
        .then((Response) => {
          this.products = Response.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postTrade(barcode) {
      this.$emit("setloading", true);
      let trade = {
        code: barcode,
        quantity: 1,
        price: 0,
        discount: 0,
        order_id: this.order.Orders.id,
      };
      toTrade(trade)
        .then((Response) => {
          success().then(() => {
            this.barcode = null;
            this.products = [];
            this.getTrades();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
          this.barcode = null;
          document.querySelector("[barcode]").focus();
        });
    },
    getTrades() {
      this.$emit("setloading", true);
      trades(this.order.Orders.id)
        .then((Response) => {
          this.trades = Response.data;
          document.querySelector("[barcode]").focus();
          this.$emit("getOrderBalance", this.order.Orders.id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    putTradeQuantity(trade, action) {
      this.$emit("setloading", true);
      swal({
        icon: "info",
        title: "Miqdorni kiriting",
        content: {
          element: "input",
          attributes: {
            type: "number",
            class: "form-control form-control-sm",
            min: "0",
            step: "any",
            placeholder: "miqdor",
          },
        },
        buttons: {
          confirm: {
            visible: true,
            text: "Ok",
            value: true,
          },
          cancel: {
            visible: true,
            text: "Bekor qilish",
            value: false,
          },
        },
      }).then((value) => {
        if (value) {
          let status = Boolean;
          let data = {
            code: trade.Trades.code,
            quantity: value,
            price: trade.Trades.price,
            discount: trade.Trades.discount,
            order_id: this.order.Orders.id,
          };
          action == "+"
            ? (status = true)
            : action == "-"
            ? (status = false)
            : false;
          updateTrade(status, data)
            .then((Response) => {
              success().then(() => {
                this.getTrades();
              });
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        } else {
          this.$emit("setloading", false);
        }
      });
    },
    putTrade(trade) {
      this.$emit("setloading", true);
      let data = {
        code: trade.Trades.code,
        quantity: 0,
        price: trade.Trades.price,
        discount: trade.Trades.discount,
        order_id: this.order.Orders.id,
      };
      updateTrade(true, data)
        .then((Response) => {
          success().then(() => {
            this.getTrades();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    deleteTrade(trade) {
      this.$emit("setloading", false);
      let data = {
        code: trade.Trades.code,
        quantity: trade.sum_quantity,
        price: trade.Trades.price,
        discount: trade.Trades.discount,
        order_id: this.order.Orders.id,
      };
      updateTrade(false, data)
        .then((Response) => {
          success().then(() => {
            this.getTrades();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
          document.querySelector("[barcode]").focus();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
