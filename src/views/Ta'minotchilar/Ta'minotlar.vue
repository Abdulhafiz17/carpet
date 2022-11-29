<template>
  <form @submit.prevent="getSupplies(0, 25)">
    <div class="row">
      <div class="col-md-5">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="from_time"
        />
      </div>
      <div class="col-md-5">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="to_time"
        />
      </div>
      <div class="col-md-2">
        <button class="btn btn-sm btn-block btn-outline-primary">
          <i class="fa fa-search" />
        </button>
      </div>
    </div>
  </form>
  <div class="responsive-y" style="height: 70vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>
            <div class="dropdown">
              <button
                class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
              >
                {{ party ? "Partiya: " + party.id : "Partiya" }}
              </button>
              <div class="dropdown-menu w-100 mt-1">
                <div
                  class="dropdown-scroll responsive-y"
                  style="max-height: 20vh"
                  @scroll="scrollDown()"
                >
                  <button
                    class="dropdown-item"
                    type="button"
                    @click="
                      party = null;
                      getSupplies(0, 25);
                    "
                  >
                    {{ "Partiya" }}
                  </button>
                  <button
                    class="dropdown-item"
                    type="button"
                    v-for="item in parties"
                    :key="item"
                    @click="
                      party = item;
                      getSupplies(0, 25);
                    "
                  >
                    {{ "Partiya: " + item.id }}
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
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in supplies" :key="item">
          <td>{{ item.Supplies.party_id }}</td>
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
          <td>
            {{ Intl.NumberFormat().format(item.Supplies.price) }}
            {{ item.currency }}
          </td>
          <td>
            {{
              Intl.NumberFormat().format(
                item.Supplies.price * item.Supplies.quantity
              )
            }}
            {{ item.currency }}
          </td>
          <td>
            {{
              item.Supplies.time
                .replace("T", " ")
                .substring(0, item.Supplies.time.length - 3)
            }}
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
              @get="getSupplies"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { catchError, parties, supplies } from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Supply",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      party_page: 0,
      party_pages: 1,
      party: null,
      parties: [],
      page: 0,
      pages: 1,
      limit: 25,
      from_time: "",
      to_time: "",
      supplies: [],
      mounted: false,
    };
  },
  created() {
    this.getParties(0);
  },
  methods: {
    getParties(page) {
      parties(true, page, 25)
        .then((Response) => {
          this.party_page = Response.data.current_page;
          this.party_pages = Response.data.pages;
          this.parties = this.parties.concat(Response.data.data);
          this.getSupplies(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    scrollDown() {
      let div = document.querySelector(".dropdown-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.party_page < this.party_pages - 1) {
          this.getParties(this.party_page + 1);
        }
      }
    },
    getSupplies(page, limit) {
      this.$emit("setloading", true);
      let party_id = this.party ? this.party.id : 0;
      supplies(
        this.from_time,
        this.to_time,
        this.$route.params.id,
        party_id,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.supplies = Response.data.data;
          this.mounted = true;
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
