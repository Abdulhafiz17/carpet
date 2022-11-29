<template>
  <h3>Mahsulot qaytarish</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        data-toggle="modal"
        data-target="#history"
        get-returned-products
      >
        <i class="fa fa-history" /> Qaytarilgan mahsulotlar
      </button>
    </div>
  </div>
  <hr />

  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <div class="input-group input-group-sm">
        <input
          type="number"
          class="form-control"
          min="0"
          placeholder="buyurtma id"
          order_id
          v-model="order_id"
          @keyup.enter="getOrder(order_id)"
        />
        <div class="input-group-append" v-if="order">
          <button class="btn btn-outline-danger" @click="clear()">
            <i class="fa fa-xmark" />
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-4"></div>
  </div>

  <div class="row gap-4" v-if="order">
    <div class="col-md-12 d-flex justify-content-between px-5">
      <h5>
        {{ order?.Orders.ordinal_number + " - buyurtma" }}
      </h5>
      <strong>
        {{ order?.Orders.time.substring(0, 10) }}
      </strong>
    </div>
    <div class="col-md-12">
      <div class="row my-1">
        <div class="col-md-3">
          Buyurtma summasi
          <br />
          {{ Intl.NumberFormat().format(balance?.total_price) + " so'm" }}
        </div>
        <div class="col-md-3">
          Chegirma summa
          <br />
          {{ Intl.NumberFormat().format(order?.Orders.discount) + " so'm" }}
        </div>
        <div class="col-md-3">
          To'lov summa
          <br />
          <span v-for="(i, index) in order_incomes" :key="i">
            {{
              i.Incomes.comment +
              ": " +
              Intl.NumberFormat().format(i.Incomes.money) +
              " so'm" +
              (index !== order_incomes.length - 1 ? ", " : "")
            }}
            <br />
          </span>
        </div>
        <div class="col-md-3">
          Mijoz nasiyasi
          <br />
          {{
            _.format(customer_loan ? customer_loan.total_loan_price : 0) +
            " so'm"
          }}
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <div class="responsive-y" style="max-height: 50vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Mahsulot</th>
              <th>Hajm</th>
              <th>Narx</th>
              <th>Chegirma</th>
              <th>Qaytarilgan</th>
              <th>Summa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in trades" :key="item">
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
                {{
                  item.sum_quantity + (item.Products.boyi ? " dona" : " metr")
                }}
              </td>
              <td>{{ _.format(item.Trades.price) + " so'm" }}</td>
              <td>{{ _.format(item.Trades.discount) + " so'm" }}</td>
              <td>
                {{
                  (returned_products.find(
                    (product) => product.Products.code == item.Products.code
                  )
                    ? returned_products.find(
                        (product) => product.Products.code == item.Products.code
                      ).Returned_products.quantity
                    : 0) + " dona"
                }}
              </td>
              <td>
                {{ _.format(item.Trades.price * item.sum_quantity) + " so'm" }}
              </td>
              <td>
                <button
                  class="btn btn-sm btn-outline-primary"
                  data-toggle="modal"
                  data-target="#returnProduct"
                  :disabled="
                    returned_products.find(
                      (product) => product.Products.code == item.Products.code
                    )
                      ? returned_products.find(
                          (product) =>
                            product.Products.code == item.Products.code
                        ).Returned_products.quantity == item.sum_quantity
                      : false
                  "
                  @click="return_product = item"
                >
                  <i class="fa fa-undo" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalMahsulotlar @setloading="setloading" />
  <ModalReturnProduct
    :return_product="return_product"
    :return_status="return_status"
    :loan_residual="customer_loan"
    @setloading="setloading"
    @clear="clear"
  />
</template>

<script>
import {
  customerLoan,
  incomes,
  order,
  returnedProducts,
  tradeBalance,
  trades,
  catchError,
} from "@/components/Api/api";
import ModalMahsulotlar from "./ModalMahsulotlar.vue";
import ModalReturnProduct from "./ModalReturnProduct.vue";
import swal from "sweetalert";
export default {
  name: "Return",
  emits: ["setloading"],
  components: { ModalMahsulotlar, ModalReturnProduct },
  data() {
    return {
      order_id: null,
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      order: null,
      balance: null,
      order_incomes: [],
      customer_loan: null,
      trades: [],
      returned_products: [],
      return_product: null,
      return_status: null,
    };
  },
  created() {
    this.$emit("setloading", false);
  },
  mounted() {
    document.querySelector("[order_id]").focus();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    clear() {
      this.order_id = null;
      this.order = null;
      this.balance = null;
      this.order_incomes = [];
      this.customer_loan = null;
      this.trades = [];
      this.returned_products = [];
      document.querySelector("[order_id]").focus();
      this.$emit("setloading", false);
    },
    getOrder(order_id) {
      this.$emit("setloading", true);
      order(order_id)
        .then((Response) => {
          this.order = Response.data;
          if (this.order) {
            this.getOrderBalance(order_id);
          } else {
            swal({
              icon: "warning",
              title: "Bunday buyurtma mavjud emas !",
              timer: 2000,
            }).then(() => {
              this.$emit("setloading", false);
              this.clear();
            });
          }
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOrderBalance(order_id) {
      tradeBalance(order_id)
        .then((Response) => {
          this.balance = Response.data;
          this.getOrderIncomes(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOrderIncomes(order_id) {
      incomes(order_id, "order", this.branch_id, 0, 25)
        .then((Response) => {
          this.order_incomes = Response.data.data;
          if (this.order.Orders.customer_id) {
            this.getCustomerLoan(order_id);
          } else {
            this.getTrades(order_id);
          }
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCustomerLoan(order_id) {
      customerLoan(this.order.Orders.customer_id)
        .then((Response) => {
          this.customer_loan = Response.data;
          this.return_status = this.customer_loan ? true : false;
          this.getTrades(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrades(order_id) {
      trades(order_id)
        .then((Response) => {
          this.trades = Response.data;
          this.getReturnedProducts(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getReturnedProducts(order_id) {
      returnedProducts(order_id, 0, 25)
        .then((Response) => {
          this.returned_products = Response.data.data;
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

<style lang="scss" scoped></style>
