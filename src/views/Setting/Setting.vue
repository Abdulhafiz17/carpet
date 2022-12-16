<template>
  <h3>Sozlamalar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <router-link to="/" class="btn btn-sm btn-outline-secondary float-right">
        <i class="fa fa-sign-out"></i> Tizimdan chiqish
      </router-link>
    </div>
  </div>
  <hr />

  <tabs
    :tab_buttons="[`Umumiy`, `Valyutalar`, `Kategoriyalar`]"
    :tab_slots="[`common`, `currencies`, `categories`]"
  >
    <template #common>
      <div :class="common_class">
        <div class="row">
          <div class="col-md-12">
            <h5>Tunggi rejim</h5>
            <p>Tizim uchun tunggi yoki tonggi mavzu</p>
          </div>
          <div class="col-md-12">
            <ul class="list-group">
              <li class="list-group-item px-5 p-2" @click="changeMode()">
                <span>Tunggi rejim</span>
                <span class="toggle-wrapper">
                  <label class="toggle">
                    <input
                      id="mode"
                      type="checkbox"
                      :checked="mode === 'dark' ? 'checked' : false"
                      @change="changeMode()"
                    />
                    <span class="toggler round">
                      <span id="sun">☀️</span>
                      <span id="moon">🌙</span>
                    </span>
                  </label>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div :class="common_class">
        <div class="row">
          <div class="col-md-12">
            <h5>Shaxsiy ma'lumotlar</h5>
            <p>
              Ism, telefon raqami, foydalanuvchi nomi yoki parolni o'zgartirish
            </p>
          </div>
          <div class="col-md-12">
            <User @setloading="setloading" />
          </div>
        </div>
      </div>
    </template>

    <template #currencies>
      <div :class="common_class">
        <Currency @setloading="setloading" />
      </div>
    </template>

    <template #categories>
      <div :class="common_class">
        <Category @setloading="setloading" />
      </div>
    </template>
  </tabs>
  <!-- <div class="row gap-2">
      <div class="col-md-12">
        <details>
          <summary>
            <span>
              <h5>Tizim</h5>
              <p>Tizim uchun tunggi yoki tonggi mavzu</p>
            </span>
          </summary>
          <div class="details-body">
            <ul class="list-group">
              <li class="list-group-item px-5 p-2" @click="changeMode()">
                <span>Tunggi rejim</span>
                <span class="toggle-wrapper">
                  <label class="toggle">
                    <input
                      id="mode"
                      type="checkbox"
                      :checked="mode === 'dark' ? 'checked' : false"
                      @change="changeMode()"
                    />
                    <span class="toggler round">
                      <span id="sun">☀️</span>
                      <span id="moon">🌙</span>
                    </span>
                  </label>
                </span>
              </li>
            </ul>
          </div>
        </details>
      </div>

      <div class="col-md-12">
        <details>
          <summary @click="getCurrencies()">
            <span>
              <h5>Valyutalar</h5>
              <p>
                Yangi valyuta qo'shish yoki mavjud valyuta ma'lumotini
                tahrirlash
              </p>
            </span>
          </summary>
          <div class="details-body">
            <div class="row gap-2">
              <div class="col-md-8 mx-auto">
                <form @submit.prevent="postCurrency(new_currency)">
                  <div class="input-group input-group-sm">
                    <div class="input-group-text">1</div>
                    <input
                      type="text"
                      class="form-control text-center"
                      placeholder="nomi"
                      required
                      v-model="new_currency.currency"
                    />
                    <div class="input-group-text">=</div>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      class="form-control text-center"
                      placeholder="narxi"
                      required
                      v-model="new_currency.price"
                    />
                    <div class="input-group-text">so'm</div>
                    <div class="input-group-append">
                      <button class="btn btn-sm btn-outline-primary">
                        <i class="fa fa-plus" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div
                class="col-md-8 mx-auto"
                v-for="item in currencies.filter(
                  (currency) => currency.currency !== `so'm`
                )"
                :key="item"
              >
                <form @submit.prevent="putCurrency(item)">
                  <div class="input-group input-group-sm">
                    <div class="input-group-text">
                      {{ "1 " + item.currency + " =" }}
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      class="form-control text-center"
                      placeholder="narxi"
                      required
                      v-model="item.price"
                    />
                    <div class="input-group-text">so'm</div>
                    <div class="input-group-append">
                      <button class="btn btn-sm btn-outline-primary">
                        <i class="fa fa-check" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </details>
      </div>

      <div class="col-md-12">
        <details>
          <summary @click="getCategories(0, 25)">
            <span>
              <h5>Kategoriyalar</h5>
              <p>
                Yangi kategoriya qo'shish yoki mavjud kategoriya ma'lumotini
                tahrirlash
              </p>
            </span>
          </summary>
          <div class="details-body">
            <div class="row gap-2">
              <div class="col-md-8 mx-auto">
                <form @submit.prevent="postCategory(new_category)">
                  <div class="input-group input-group-sm">
                    <input
                      type="text"
                      class="form-control text-center"
                      placeholder="nomi"
                      required
                      v-model="new_category.name"
                    />
                    <select
                      class="form-select form-select-sm text-center"
                      required
                      v-model="new_category.type"
                    >
                      <option value="" hidden>turi</option>
                      <option value="dona">dona</option>
                      <option value="metr">metr</option>
                    </select>
                    <div class="input-group-append">
                      <button class="btn btn-sm btn-outline-primary">
                        <i class="fa fa-check" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div
                class="col-md-8 mx-auto"
                v-for="item in categories"
                :key="item"
              >
                <form @submit.prevent="putCategory(item)">
                  <div class="input-group input-group-sm">
                    <input
                      type="text"
                      class="form-control text-center"
                      placeholder="nomi"
                      required
                      v-model="item.name"
                    />
                    <select
                      class="form-select form-select-sm text-center"
                      required
                      v-model="item.type"
                    >
                      <option value="">turi</option>
                      <option value="dona">dona</option>
                      <option value="metr">metr</option>
                    </select>
                    <div class="input-group-append">
                      <button class="btn btn-sm btn-outline-primary">
                        <i class="fa fa-check" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="col-md-5 mx-auto">
                <Pagination
                  :page="page"
                  :pages="pages"
                  :limit="limit"
                  @get="getCategories"
                />
              </div>
            </div>
          </div>
        </details>
      </div>
    </div> -->
</template>

<script>
import User from "./User.vue";
import Currency from "./Currency.vue";
import Category from "./Category.vue";
export default {
  name: "Setting",
  emits: ["setloading"],
  components: { User, Currency, Category },
  data() {
    return {
      common_class: "p-3 mb-1 border border-primary rounded text-left",
      mode: document.querySelector("#app").classList[0],
    };
  },
  created() {},
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    changeMode() {
      if (this.mode) {
        this.mode = "";
        document.querySelector("#app").classList.remove("dark");
        localStorage.setItem("mode", this.mode);
      } else {
        this.mode = "dark";
        document.querySelector("#app").classList.add("dark");
        localStorage.setItem("mode", this.mode);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.form-control {
  position: relative;
}

.form-control::before {
  content: "123456789";
  position: absolute;
  bottom: 0;
  width: 200px;
  height: 10vh;
  padding: 5px;
  color: #2196f3;
  background-color: lightslategrey;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 55px;
  height: 24px;
  margin: 5px;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggler {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dark);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.toggler:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 1px;
  background: lightgray;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.dark .toggler::before {
  background: rgb(50, 55, 65);
}

input:focus + toggler {
  box-shadow: 0 0 2px #2196f3;
}

input:checked + .toggler:before {
  -webkit-transform: translateX(31px);
  -ms-transform: translateX(31px);
  transform: translateX(31px);
}

.dark .toggler.round {
  background: gray;
  border-radius: 34px;
  width: 60px;
}

.toggler.round {
  border-radius: 34px;
  width: 60px;
}

.toggler.round:before {
  border-radius: 50%;
}

#sun {
  float: left;
  margin-top: -3px;
  font-size: 1.3rem;
}

#moon {
  float: right;
  margin-top: -4px;
  font-size: 1.3rem;
}
</style>
