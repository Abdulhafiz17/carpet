<template>
  <div class="row" v-if="supply_status == 'false'">
    <div class="col-md-4 mb-1">
      <div class="dropdown">
        <button
          id="dropdownMenuButtonMarkets"
          type="button"
          class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
          data-toggle="dropdown"
          @click="getMarkets()"
        >
          {{ market ? market.name : "Ta'minotchi" }}
        </button>
        <div
          class="dropdown-menu w-100 mt-1"
          aria-labelledby="dropdownMenuButtonMarkets"
        >
          <button
            type="button"
            class="dropdown-item text-center"
            disabled
            v-show="!markets.length"
          >
            <i class="fa-solid fa-circle-notch fa-spin" />
          </button>
          <div
            class="responsive-y markets-scroll"
            style="max-height: 20vh"
            @scroll="scrollMarkets()"
          >
            <button
              type="button"
              class="dropdown-item"
              v-for="item in markets"
              :key="item"
              @click="market = item"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-1">
      <div class="dropdown">
        <button
          id="dropdownMenuButtonCategories"
          type="button"
          class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
          data-toggle="dropdown"
          @click="getCategories()"
        >
          {{ category ? category.name : "Kategoriya" }}
        </button>
        <div
          class="dropdown-menu w-100 mt-1"
          aria-labelledby="dropdownMenuButtonCategories"
        >
          <button
            type="button"
            class="dropdown-item text-center"
            disabled
            v-show="!categories.length"
          >
            <i class="fa-solid fa-circle-notch fa-spin" />
          </button>
          <div
            class="responsive-y categories-scroll"
            style="max-height: 20vh"
            @scroll="scrollCategories()"
          >
            <button
              type="button"
              class="dropdown-item"
              v-for="item in categories"
              :key="item"
              @click="category = item"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-1">
      <input
        type="text"
        class="form-control form-control-sm"
        placeholder="artikul"
        required
        v-model="new_supply.articul"
      />
    </div>
    <div :class="`col-md-${category?.type == 'dona' ? 3 : 4} mb-1`">
      <div class="input-group input-group-sm">
        <input
          type="number"
          min="0"
          step="any"
          class="form-control"
          placeholder="eni"
          required
          v-model="new_supply.eni"
        />
        <div class="input-group-text">metr</div>
      </div>
    </div>
    <div class="col-md-3 mb-1" v-if="category?.type == 'dona'">
      <div class="input-group input-group-sm">
        <input
          type="number"
          min="0"
          step="any"
          class="form-control"
          placeholder="bo'yi"
          required
          v-model="new_supply.boyi"
        />
        <div class="input-group-text">metr</div>
      </div>
    </div>
    <div :class="`col-md-${category?.type == 'dona' ? 2 : 4} mb-1`">
      <div class="input-group input-group-sm">
        <input
          type="number"
          min="0"
          step="any"
          class="form-control"
          :placeholder="category?.type == 'dona' ? `miqdor` : `bo'yi`"
          required
          v-model="new_supply.quantity"
        />
        <div class="input-group-text">
          {{ category?.type == "dona" ? "dona" : "metr" }}
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-1">
      <div class="input-group input-group-sm">
        <input
          type="number"
          min="0"
          step="any"
          class="form-control"
          placeholder="narx"
          required
          v-model="new_supply.price"
        />
        <div class="input-group-append">
          <div class="dropdown">
            <button
              id="dropdownMenuButtonCategories"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              @click="getCurrencies()"
            >
              {{ currency ? currency.currency : "valyuta" }}
            </button>
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonCategories"
            >
              <button
                type="button"
                class="dropdown-item text-center"
                disabled
                v-show="!currencies.length"
              >
                <i class="fa-solid fa-circle-notch fa-spin" />
              </button>
              <button
                type="button"
                class="dropdown-item"
                v-for="item in currencies"
                :key="item"
                @click="currency = item"
              >
                {{ item.currency }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-1 mb-1">
      <button
        class="btn btn-sm btn-block btn-outline-primary"
        :disabled="
          !market ||
          !category ||
          !new_supply.articul ||
          !new_supply.eni ||
          (category?.type == 'dona' ? !new_supply.boyi : false) ||
          !new_supply.price ||
          !currency
        "
        @click="addSupply(new_supply)"
      >
        <i class="far fa-circle-check" />
      </button>
    </div>
  </div>
  <div class="responsive-y mt-2" :style="`height: ${supply_status == 'false' ? '60vh' : '73vh'}`">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>
            <div class="dropdown">
              <button
                id="dropdownMenuButtonMarkets"
                type="button"
                class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                data-toggle="dropdown"
                @click="getMarkets()"
              >
                {{
                  supplies_market_id
                    ? markets.find((market) => market.id == supplies_market_id)
                        .name
                    : "Ta'minotchi"
                }}
              </button>
              <div
                class="dropdown-menu w-100 mt-1"
                aria-labelledby="dropdownMenuButtonMarkets"
              >
                <button
                  type="button"
                  class="dropdown-item text-center"
                  disabled
                  v-show="!markets.length"
                >
                  <i class="fa-solid fa-circle-notch fa-spin" />
                </button>
                <div
                  class="responsive-y markets-scroll"
                  style="max-height: 20vh"
                  @scroll="scrollMarkets()"
                >
                  <button
                    type="button"
                    class="dropdown-item"
                    @click="
                      supplies_market_id = 0;
                      getSupplies(0, 25);
                    "
                  >
                    {{ "Ta'minotchi" }}
                  </button>
                  <button
                    type="button"
                    class="dropdown-item"
                    v-for="item in markets"
                    :key="item"
                    @click="
                      supplies_market_id = item.id;
                      getSupplies(0, 25);
                    "
                  >
                    {{ item.name }}
                  </button>
                </div>
              </div>
            </div>
          </th>
          <th>Kategoriya</th>
          <th>Artikul</th>
          <th>O'lcham</th>
          <th>Hajm</th>
          <th>Narx</th>
          <th>Summa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in supplies" :key="item">
          <td>{{ item.market }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.Supplies.articul }}</td>
          <td>
            {{
              item.Supplies.eni +
              (item.Supplies.boyi ? " x " + item.Supplies.boyi : " metr")
            }}
          </td>
          <td>
            {{
              item.Supplies.quantity + (item.Supplies.boyi ? " dona" : " metr")
            }}
          </td>
          <td>{{ _.format(item.Supplies.price) + " " + item.currency }}</td>
          <td>
            {{
              _.format(item.Supplies.price * item.Supplies.quantity) +
              " " +
              item.currency
            }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="7">
            <Pagination
              :page="supplies_page"
              :pages="supplies_pages"
              :limit="supplies_limit"
              @get="getSupplies"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import {
  catchError,
  categories,
  currencies,
  markets,
  success,
  supplies,
  takeSupply,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Products",
  emits: ["setloading", "getBalance"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      supply_status: localStorage.getItem("supply_status"),
      markets_page: 0,
      markets_pages: 1,
      markets: [],
      market: null,
      categories_page: 0,
      categories_pages: 1,
      categories: [],
      category: null,
      currencies: [],
      currency: null,
      supplies_page: 0,
      supplies_pages: 1,
      supplies_limit: 25,
      supplies_market_id: 0,
      supplies: [],
      new_supply: {
        category_id: null,
        articul: null,
        eni: null,
        boyi: null,
        quantity: null,
        price: null,
        currency_id: null,
        market_id: null,
        party_id: this.$route.params.id,
      },
    };
  },
  created() {
    this.getSupplies(0, 25);
  },
  methods: {
    getSupplies(page, limit) {
      this.$emit("setloading", true);
      supplies(
        "",
        "",
        this.supplies_market_id,
        this.$route.params.id,
        page,
        limit
      )
        .then((Response) => {
          this.supplies_page = Response.data.current_page;
          this.supplies_pages = Response.data.pages;
          this.supplies_limit = Response.data.limit;
          this.supplies = Response.data.data;
          this.$emit("getBalance", "products");
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    addSupply(supply) {
      this.$emit("setloading", true);
      supply.market_id = this.market.id;
      supply.category_id = this.category.id;
      supply.currency_id = this.currency.id;
      supply.boyi = supply.boyi ? supply.boyi : 0;
      takeSupply(supply)
        .then((Response) => {
          success().then(() => {
            this.market = null;
            this.category = null;
            this.currency = null;
            this.new_supply = {
              category_id: null,
              articul: null,
              eni: null,
              boyi: null,
              quantity: null,
              price: null,
              currency_id: null,
              market_id: null,
              party_id: this.$route.params.id,
            };
            this.getSupplies(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getMarkets() {
      markets(0, 25)
        .then((Response) => {
          this.markets_page = 0;
          this.markets_pages = Response.data.pages;
          this.markets = Response.data.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCategories() {
      categories("", "", 0, 25)
        .then((Response) => {
          this.categories_page = 0;
          this.categories_pages = Response.data.pages;
          this.categories = Response.data.data;
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
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    scrollMarkets() {
      let div = document.querySelector(".markets-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.markets_page < this.markets_pages - 1) {
          markets(this.markets_page + 1, 25)
            .then((Response) => {
              this.markets_page = Response.data.current_page;
              this.markets = this.markets.concat(Response.data.data);
            })
            .catch((error) => {
              catchError(error);
            });
        }
      }
    },
    scrollCategories() {
      let div = document.querySelector(".categories-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.categories_page < this.categories_pages - 1) {
          categories("", "", this.categories_page + 1, 25)
            .then((Response) => {
              this.categories_page = Response.data.current_page;
              this.categories = this.categories.concat(Response.data.data);
            })
            .catch((error) => {
              catchError(error);
            });
        }
      }
    },
  },
};
</script>
