<template>
  <h3>Mahsulotlar</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          type="search"
          placeholder="Qidiruv"
          class="form-control"
          v-model="search"
          @focus="search = ''"
          @keyup="
            getProducts(0, 25);
            $emit('setloading', false);
          "
        />
        <div class="input-group-text">
          <i class="fa fa-search" />
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-primary"
        data-toggle="modal"
        data-target="#showcase"
      >
        <i class="fa fa-bars" /> Vitrinalar
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive-y" style="height: 80vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>
            <div class="dropdown">
              <button
                id="dropdownMenuButtonShowcases"
                type="button"
                class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                data-toggle="dropdown"
                @click="getLocations()"
              >
                {{ location ? location.name : "Vitrina" }}
              </button>
              <div
                class="dropdown-menu w-100 mt-1"
                aria-labelledby="dropdownMenuButtonShowcases"
              >
                <div
                  class="responsive-y showcase-scroll"
                  style="max-height: 20vh"
                  @scroll="scrollShowcases()"
                >
                  <button
                    type="button"
                    class="dropdown-item"
                    @click="
                      location = null;
                      getProducts(0, 25);
                    "
                  >
                    {{ "Vitrina" }}
                  </button>
                  <button
                    type="button"
                    class="dropdown-item"
                    v-for="item in showcases"
                    :key="item"
                    @click="
                      location = item;
                      getProducts(0, 25);
                    "
                  >
                    {{ item.name }}
                  </button>
                </div>
              </div>
            </div>
          </th>
          <th>
            <div class="dropdown">
              <button
                id="dropdownMenuButtonCategories"
                type="button"
                class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                data-toggle="dropdown"
              >
                {{ category ? category.name : "Kategoriya" }}
              </button>
              <div
                class="dropdown-menu w-100 mt-1"
                aria-labelledby="dropdownMenuButtonCategories"
              >
                <div
                  class="responsive-y category-scroll"
                  style="max-height: 20vh"
                  @scroll="scrollCategories()"
                >
                  <button
                    type="button"
                    class="dropdown-item"
                    @click="
                      category = null;
                      getProducts(0, 25);
                    "
                  >
                    {{ "Kategoriya" }}
                  </button>
                  <button
                    type="button"
                    class="dropdown-item"
                    v-for="item in categories"
                    :key="item"
                    @click="
                      category = item;
                      getProducts(0, 25);
                    "
                  >
                    {{ item.name }}
                  </button>
                </div>
              </div>
            </div>
          </th>
          <th>Artikul</th>
          <th>Shtrix kod</th>
          <th>O'lcham</th>
          <th>Hajm</th>
          <th>Tan narx</th>
          <th>Oxirgi narx</th>
          <th>Sotuv narx</th>
          <th>Vitrina narx</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item">
          <td>{{ item.pr_loc ? item.pr_loc : "" }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.Products.articul }}</td>
          <td>{{ item.Products.code }}</td>
          <td>
            {{
              item.Products.eni +
              (item.Products.boyi ? " x " + item.Products.boyi : " metr")
            }}
          </td>
          <td>
            {{ item.sum_quantity + (item.Products.boyi ? " dona" : " metr") }}
          </td>
          <td>
            {{
              _.format(item.Products.price) +
              " " +
              item.tan_narx_currency.currency
            }}
          </td>
          <td>
            {{
              _.format(item.Products.oxirgi_narx) + " " + item.oxirgi.currency
            }}
          </td>
          <td>
            {{ _.format(item.Products.sotuv_narx) + " " + item.sotuv.currency }}
          </td>
          <td>
            {{
              _.format(item.Products.vitrina_narx) + " " + item.vitrina.currency
            }}
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-sm btn-outline-warning"
                data-toggle="modal"
                data-target="#editProduct"
                @click="product_edit = item"
              >
                <i class="fa fa-edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-success"
                data-toggle="modal"
                data-target="#photoProduct"
                @click="product_photo = item"
              >
                <i class="fa fa-image" />
              </button>
              <button
                class="btn btn-sm btn-outline-primary"
                data-toggle="modal"
                data-target="#barcodeProduct"
                @click="product_barcode = item"
              >
                <i class="fa fa-barcode" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="11">
            <Pagination
              :page="page"
              :pages="pages"
              :limit="limit"
              @get="getProducts"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <ModalShowcase @setloading="setloading" />
  <ModalEdit
    :product_edit="product_edit"
    @setloading="setloading"
    @getProducts="getProducts"
  />
  <ModalPhoto :product_photo="product_photo" @setloading="setloading" />
  <ModalBarcode :product_barcode="product_barcode" @setloading="setloading" />
</template>

<script>
import {
  catchError,
  categories,
  productLocations,
  products,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
import ModalShowcase from "./ModalShowcase.vue";
import ModalEdit from "./ModalEdit.vue";
import ModalPhoto from "./ModalPhoto.vue";
import ModalBarcode from "./ModalBarcode.vue";
export default {
  name: "Mahsulotlar",
  emits: ["setloading"],
  components: {
    Pagination,
    ModalShowcase,
    ModalEdit,
    ModalPhoto,
    ModalBarcode,
  },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      search: "",
      showcases_page: 0,
      showcases_pages: 1,
      showcases: [],
      location: null,
      category_page: 0,
      category_pages: 1,
      categories: [],
      category: null,
      page: 0,
      pages: 1,
      limit: 25,
      products: [],
      product_edit: null,
      product_photo: null,
      product_barcode: null,
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getLocations() {
      productLocations(0, 25)
        .then((Response) => {
          this.showcases_page = Response.data.current_page;
          this.showcases_pages = Response.data.pages;
          this.showcases = Response.data.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCategories() {
      categories("", "", 0, 25)
        .then((Response) => {
          this.category_page = Response.data.current_page;
          this.category_pages = Response.data.pages;
          this.categories = Response.data.data;
          this.getProducts(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProducts(page, limit) {
      this.$emit("setloading", true);
      let category_id = this.category ? this.category.id : 0;
      let location_id = this.location ? this.location.id : 0;
      products(
        this.search,
        category_id,
        this.branch_id,
        location_id,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.products = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    scrollShowcases() {
      let div = document.querySelector(".showcase-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.showcases_page < this.showcases_pages - 1) {
          productLocations(this.showcases_page + 1, 25)
            .then((Response) => {
              this.showcases_page = Response.data.current_page;
              this.showcases = this.showcases.concat(Response.data.data);
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      }
    },
    scrollCategories() {
      let div = document.querySelector(".category-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.category_page < this.category_pages - 1) {
          categories("", "", this.category_page + 1, 25)
            .then((Response) => {
              this.category_page = Response.data.current_page;
              this.categories = this.categories.concat(Response.data.data);
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
