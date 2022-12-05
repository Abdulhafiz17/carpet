<template>
  <nav class="desktop">
    <router-link class="link" to="/filiallar" v-if="role == 'admin'">
      Filiallar
    </router-link>
    <router-link class="link" to="/omborlar" v-if="role == 'admin'">
      Omborlar
    </router-link>
    <router-link class="link" to="/taminotlar" v-if="role == 'admin'">
      Ta'minotlar
    </router-link>
    <router-link class="link" to="/taminotchilar" v-if="role == 'admin'">
      Ta'minotchilar
    </router-link>
    <router-link class="link" to="/kassa" v-if="role == 'branch_admin'">
      Kassa
    </router-link>
    <router-link
      class="link"
      :to="'/hisobotlar/' + branch_id"
      v-if="role == 'branch_admin'"
    >
      Hisobotlar
    </router-link>
    <router-link
      class="link"
      :to="'/hodimlar/' + branch_id"
      v-if="role == 'branch_admin'"
    >
      Hodimlar
    </router-link>
    <router-link class="link" to="/mijozlar" v-if="role == 'branch_admin'">
      Mijozlar
    </router-link>
    <router-link class="link" to="/credits" v-if="role == 'branch_admin'">
      Muddatli to'lov
    </router-link>
    <router-link class="link" to="/nasiyalar" v-if="role == 'branch_admin'">
      Nasiyalar
    </router-link>
    <router-link class="link" to="/return" v-if="role == 'branch_admin'">
      Mahsulot qaytarish
    </router-link>
    <router-link class="link" to="/taminot" v-if="role == 'branch_admin'">
      Ta'minot
    </router-link>
    <router-link class="link" to="/mahsulotlar" v-if="role == 'branch_admin'">
      Mahsulotlar
    </router-link>
    <router-link class="link" to="/chiqim" v-if="role == 'branch_admin'">
      Chiqim
    </router-link>
    <router-link class="link" to="/setting">Sozlamalar</router-link>
  </nav>

  <nav class="mobile text-right">
    <button
      class="btn btn-sm"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasExample"
      aria-controls="offcanvasExample"
    >
      <i class="fa fa-bars" />
    </button>
  </nav>

  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel"
    data-bs-dismiss="offcanvas"
  >
    <div class="offcanvas-header justify-content-end">
      <button
        type="button"
        class="btn btn-sm"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      >
        <i class="fa fa-lg fa-xmark" />
      </button>
    </div>
    <div class="offcanvas-body">
      <ul class="list-group">
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/filiallar"
          v-if="role == 'admin'"
        >
          Filiallar
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/omborlar"
          v-if="role == 'admin'"
        >
          Omborlar
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/taminotlar"
          v-if="role == 'admin'"
        >
          Ta'minotlar
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/taminotchilar"
          v-if="role == 'admin'"
        >
          Ta'minotchilar
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/kassa"
          v-if="role == 'branch_admin'"
        >
          Kassa
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          :to="'/hisobotlar/' + branch_id"
          v-if="role == 'branch_admin'"
        >
          Hisobotlar
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          :to="'/hodimlar/' + branch_id"
          v-if="role == 'branch_admin'"
        >
          Hodimlar
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/mijozlar"
          v-if="role == 'branch_admin'"
        >
          Mijozlar
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/credits"
          v-if="role == 'branch_admin'"
        >
          Muddatli to'lov
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/nasiyalar"
          v-if="role == 'branch_admin'"
        >
          Nasiyalar
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/return"
          v-if="role == 'branch_admin'"
        >
          Mahsulot qaytarish
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/taminot"
          v-if="role == 'branch_admin'"
        >
          Ta'minot
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/mahsulotlar"
          v-if="role == 'branch_admin'"
        >
          Mahsulotlar
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/chiqim"
          v-if="role == 'branch_admin'"
        >
          Chiqim
        </router-link>
        <router-link
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          to="/setting"
        >
          Sozlamalar
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      role: localStorage.getItem("role"),
      branch_id: localStorage.getItem("branch_id"),
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
nav.desktop {
  display: block;
}
nav {
  padding: 5px;
  text-align: left;
  box-shadow: 0 1px 50px -5px rgb(50, 55, 65);

  a {
    position: relative;
    padding: 5px;
    font-size: 15px;
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    transition: 0.2s all;

    // &:first-child {
    //   border-radius: 4px 0 0 4px;
    // }

    // &:last-child {
    //   border-radius: 0 4px 4px 0;
    // }

    &:hover {
      background: rgb(50, 55, 65, 0.2);
    }

    &::after {
      content: "";
      display: block;
      position: absolute;
      bottom: 5%;
      left: 50%;
      right: 50%;
      width: 0;
      height: 2px;
      background: rgb(50, 55, 65);
      transition: 0.2s all;
    }

    &:hover::after {
      left: 5%;
      right: 5%;
      width: 90%;
    }

    &.router-link-exact-active {
      color: whitesmoke;
      background: rgb(50, 55, 65);
    }

    &.router-link-exact-active::after {
      background: rgb(245, 245, 245);
    }

    &.router-link-exact-active:hover {
      color: whitesmoke;
      background: rgb(50, 55, 65);
    }

    &.router-link-exact-active:hover::after {
      left: 50%;
      right: 50%;
      width: 0;
    }
  }
}

.dark nav.desktop {
  box-shadow: 0 1px 20px -5px black;

  a {
    color: rgb(245, 245, 245);

    &:hover {
      background: rgb(245, 245, 245, 0.2);
    }

    &::after {
      background: rgb(245, 245, 245);
    }

    &.router-link-exact-active {
      color: rgb(50, 55, 65);
      background: rgb(245, 245, 245);
    }

    &.router-link-exact-active::after {
      background: rgb(50, 55, 65);
    }

    &.router-link-exact-active:hover {
      color: rgb(50, 55, 65);
      background: rgb(245, 245, 245);
    }
  }
}

nav.mobile {
  display: none;
  padding: 5px;
  text-align: left;
  box-shadow: 0 1px 50px -5px rgb(50, 55, 65);
}
.dark nav.mobile {
  box-shadow: 0 1px 20px -5px black;
}

@media (max-width: 768px) {
  nav.mobile {
    display: block;
  }

  nav.desktop {
    display: none;
  }
}
</style>
