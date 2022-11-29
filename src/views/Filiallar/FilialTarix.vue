<template>
  <h3>
    {{ branch?.Branches.name + " tarixi" }}
  </h3>
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
        @click="
          template = 'active';
          from_time = '';
          to_time = '';
          warehouse_id = 0;
          getTransfersWaiting(0, 25);
        "
      >
        Faol ta'minotlar
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        data-toggle="pill"
        @click="
          template = 'inactive';
          from_time = '';
          to_time = '';
          warehouse_id = 0;
          getTransfersAccepted(0, 25);
        "
      >
        Yankunlangan ta'minotlar
      </button>
    </li>
  </ul>

  <div class="tab-content pt-2">
    <div v-if="template == 'active'">
      <div class="row">
        <div class="col-md-5 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_time"
          />
        </div>
        <div class="col-md-5 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_time"
          />
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getTransfersWaiting(0, 25)"
          >
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div class="responsive-y" style="max-height: 70vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>
                <select
                  class="form-select form-select-sm"
                  v-model="warehouse_id"
                  @change="getTransfersWaiting(0, 25)"
                >
                  <option value="0">Barcha omborlar</option>
                  <option
                    v-for="item in warehouses"
                    :key="item"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </th>
              <th>Kategoriya</th>
              <th>Artikul</th>
              <th>O'lcham</th>
              <th>Hajm</th>
              <th>Narx</th>
              <th>Summa</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transfers_waiting" :key="item">
              <td>{{ item.warehouse }}</td>
              <td>{{ item.Categories.name }}</td>
              <td>{{ item.Warehouse_products.articul }}</td>
              <td>
                {{
                  item.Warehouse_products.eni +
                  (item.Warehouse_products.boyi
                    ? " x " + item.Warehouse_products.boyi
                    : " metr")
                }}
              </td>
              <td>
                {{
                  item.Transfers.quantity +
                  (item.Warehouse_products.boyi ? " dona" : " metr")
                }}
              </td>
              <td>
                {{
                  _.format(item.Transfers.transfer_price) +
                  " " +
                  item.Currencies.currency
                }}
              </td>
              <td>
                {{
                  _.format(
                    item.Transfers.transfer_price * item.Transfers.quantity
                  ) +
                  " " +
                  item.Currencies.currency
                }}
              </td>
              <td>
                {{ item.Transfers.time.replace("T", " ").substring(0, 16) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="8">
                <Pagination
                  :page="page"
                  :pages="pages"
                  :limit="limit"
                  @get="getTransfersWaiting"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div v-if="template == 'inactive'">
      <div class="row">
        <div class="col-md-5 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_time"
          />
        </div>
        <div class="col-md-5 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_time"
          />
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getTransfersAccepted(0, 25)"
          >
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div class="responsive-y" style="max-height: 70vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>
                <select
                  class="form-select form-select-sm"
                  v-model="warehouse_id"
                  @change="getTransfersAccepted(0, 25)"
                >
                  <option value="0">Barcha omborlar</option>
                  <option
                    v-for="item in warehouses"
                    :key="item"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </th>
              <th>Kategoriya</th>
              <th>Artikul</th>
              <th>O'lcham</th>
              <th>Hajm</th>
              <th>Narx</th>
              <th>Summa</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transfers_accepted" :key="item">
              <td>{{ item.warehouse }}</td>
              <td>{{ item.Categories.name }}</td>
              <td>{{ item.Warehouse_products.articul }}</td>
              <td>
                {{
                  item.Warehouse_products.eni +
                  (item.Warehouse_products.boyi
                    ? " x " + item.Warehouse_products.boyi
                    : " metr")
                }}
              </td>
              <td>
                {{
                  item.Transfers.quantity +
                  (item.Warehouse_products.boyi ? " dona" : " metr")
                }}
              </td>
              <td>
                {{
                  _.format(item.Transfers.transfer_price) +
                  " " +
                  item.Currencies.currency
                }}
              </td>
              <td>
                {{
                  _.format(
                    item.Transfers.transfer_price * item.Transfers.quantity
                  ) +
                  " " +
                  item.Currencies.currency
                }}
              </td>
              <td>
                {{ item.Transfers.time.replace("T", " ").substring(0, 16) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="8">
                <Pagination
                  :page="page"
                  :pages="pages"
                  :limit="limit"
                  @get="getTransfersAccepted"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  branch,
  catchError,
  transfers,
  warehouses,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Tarix",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      id: this.$route.params.id,
      branch: null,
      template: "active",
      page: 0,
      pages: 1,
      limit: 25,
      from_time: "",
      to_time: "",
      warehouse_id: 0,
      warehouses: [],
      transfers_waiting: [],
      transfers_accepted: [],
    };
  },
  created() {
    this.getBranch();
  },
  methods: {
    getBranch() {
      branch(this.id)
        .then((Response) => {
          this.branch = Response.data;
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
          this.getTransfersWaiting(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTransfersWaiting(page, limit) {
      this.$emit("setloading", true);
      transfers(
        this.warehouse_id,
        "filialga_berish_kutish",
        this.$route.params.id,
        this.from_time,
        this.to_time,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.transfers_waiting = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTransfersAccepted(page, limit) {
      this.$emit("setloading", true);
      transfers(
        this.warehouse_id,
        "filialga_berish_tasdiqlandi",
        this.$route.params.id,
        this.from_time,
        this.to_time,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.transfers_accepted = Response.data.data;
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