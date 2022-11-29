import router from "@/router";
import axios from "axios";
import swal from "sweetalert";

const api = axios.create({
  baseURL: "https://carpet-api.crud.uz/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const url = "https://carpet-api.crud.uz/uploaded_files/";

export function success(target) {
  if (target !== undefined) {
    if (typeof target == "number") {
      document.querySelectorAll("[data-dismiss='modal']")[target].click();
    } else if (typeof target == "string") {
      document.querySelector(`[${target}]`).click();
    }
  }
  return swal({
    icon: "success",
    title: " ",
    buttons: false,
    timer: 800,
    closeOnEsc: false,
    closeOnClickOutside: false,
  });
}

export function catchError(error) {
  console.error(error);
  if (error.response.status == 401) {
    swal({
      icon: "warning",
      title: "Ism yoki parolda xatolik !",
      timer: 2000,
    }).then(() => {
      if (location.pathname !== "/") {
        router.push("/");
      }
    });
  } else if (error.response.status == 400) {
    swal({
      icon: "warning",
      title: error.response.data.detail,
      timer: 2500,
    });
  } else if (error.response.status == 404) {
    swal({
      icon: "warning",
      title: "URL manzili noto'g'ri !",
      timer: 2000,
    });
  } else if (error.response.status == 422) {
    swal({
      icon: "warning",
      title: "Ma'lumotlar to'liq emas !",
      timer: 2000,
    });
  } else if (error.message == "Network Error") {
    swal({
      icon: "warning",
      title: "Server bilan aloqa mavjud emas !",
      timer: 2000,
    });
  }
}

// token

export function token(data) {
  let params = new URLSearchParams();

  params.append("username", data.username);
  params.append("password", data.password);

  return api.post("token", params);
}

// files

export function uploadFile(articul, file) {
  return api.post(`upload_file/${articul}`, file);
}
export function uploadedFiles(source, for_) {
  return api.get(`get_uploaded_files?source=${source}&for_=${for_}`);
}
export function removeFile(file_id) {
  return api.delete(`remove_file/${file_id}`);
}

// currencies

export function currencies() {
  return api.get(`get_currencies`);
}
export function createCurrency(data) {
  return api.post(`create_currency`, data);
}
export function updateCurrency(data) {
  return api.put(`update_currency/${data.id}`, data);
}

// branches

export function branch(branch_id) {
  return api.get(`get_branch/${branch_id}`);
}
export function branches() {
  return api.get(`get_branches`);
}
export function createBranch(data) {
  return api.post(`create_branch`, data);
}
export function updateBranch(id, data) {
  return api.put(`update_branch/${id}`, data);
}

// warehouses

export function warehouse(id) {
  return api.get(`this_warehouse/${id}`);
}
export function warehouses() {
  return api.get(`get_warehouses`);
}
export function createWarehouse(data) {
  return api.post(`create_warehouse`, data);
}
export function updateWarehouse(data) {
  return api.put(`update_warehouse/${data.id}`, data);
}

// warehouse products

export function warehouseProducts(warehouse_id, category_id, page, limit) {
  return api.get(
    `get_warehouse_products?warehouse_id=${warehouse_id}&category_id=${category_id}&page=${page}&limit=${limit}`
  );
}
export function addProductToWarehouse(data) {
  return api.post(`add_product`, data);
}
export function removeWarehouseProduct(product_id, quantity) {
  return api.delete(`remove_w_product/${product_id}/${quantity}`);
}

// markets

export function market(market_id) {
  return api.get(`get_market/${market_id}`);
}
export function markets(page, limit) {
  return api.get(`get_markets?page=${page}&limit=${limit}`);
}
export function createMarket(data) {
  return api.post(`create_market`, data);
}
export function updateMarket(data) {
  return api.put(`update_market/${data.id}`, data);
}

// parties

export function createParty() {
  return api.post(`create_party`);
}
export function parties(status, page, limit) {
  if (status)
    return api.get(`get_parties?status=${status}&page=${page}&limit=${limit}`);
  else return api.get(`get_parties?page=${page}&limit=${limit}`);
}
export function partyBalance(party_id) {
  return api.get(`get_party_balances/${party_id}`);
}
export function confirmationParty(
  party_id,
  warehouse_id,
  currency_id,
  to_branch
) {
  return api.post(
    `confirmation_party/${party_id}/${warehouse_id}/${currency_id}?to_branch=${to_branch}`
  );
}

// supplies

export function supplies(from_time, to_time, market_id, party_id, page, limit) {
  if (from_time && to_time)
    return api.get(
      `get_supplies?from_time=${from_time}&to_time=${to_time}&market_id=${market_id}&party_id=${party_id}&page=${page}&limit=${limit}`
    );
  else
    return api.get(
      `get_supplies?market_id=${market_id}&party_id=${party_id}&page=${page}&limit=${limit}`
    );
}
export function takeSupply(data) {
  return api.post(`take_supply`, data);
}

// transfers

export function transfers(
  warehouse_id,
  status,
  branch_id,
  from_time,
  to_time,
  page,
  limit
) {
  if (from_time && to_time)
    return api.get(
      `get_transfers?warehouse_id=${warehouse_id}&status=${status}&branch_id=${branch_id}&from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`
    );
  else
    return api.get(
      `get_transfers?warehouse_id=${warehouse_id}&status=${status}&branch_id=${branch_id}&page=${page}&limit=${limit}`
    );
}
export function transferProducts(data) {
  return api.post(`transfer_product`, data);
}
export function removeTransfer(transfer_id) {
  return api.delete(`remove_transfer/${transfer_id}`);
}
export function acceptTransfer(transfer_id, data) {
  return api.post(`acceptance_product/${transfer_id}`, data);
}

// categories

export function categories(type, search, page, limit) {
  if (type && search)
    return api.get(
      `get_categories?type=${type}&search=${search}&page=${page}&limit=${limit}`
    );
  else if (type && !search)
    return api.get(`get_categories?type=${type}&page=${page}&limit=${limit}`);
  else if (!type && search)
    return api.get(
      `get_categories?search=${search}&page=${page}&limit=${limit}`
    );
  else if (!type && !search)
    return api.get(`get_categories?page=${page}&limit=${limit}`);
}
export function createCategory(data) {
  return api.post(`create_category`, data);
}
export function updateCategory(data) {
  return api.put(`update_category/${data.id}`, data);
}

// users

export function user(user_id) {
  if (user_id) return api.get(`this_user?user_id=${user_id}`);
  else return api.get(`this_user`);
}
export function users(branch_id, page, limit) {
  return api.get(
    `get_users?branch_id=${branch_id}&page=${page}&limit=${limit}`
  );
}
export function createUser(data) {
  return api.post(`create_user`, data);
}
export function updateUser(data) {
  return api.put(`update_user/${data.id}`, data);
}

// expenses

// fixed expenses
export function createFixedExpense(data) {
  return api.post(`create_fixed_expense`, data);
}
export function getFixedExpenses() {
  return api.get(`get_fixed_expenses`);
}
export function updateFixedExpense(data) {
  return api.put(`update_fixed_expense/${data.id}`, data);
}
export function payForFixedExpense(data) {
  return api.post(`pay_for_fixed_expense`, data);
}
export function fixedExpenses(
  branch_id,
  from_time,
  to_time,
  expense_id,
  page,
  limit
) {
  let time =
    from_time && to_time ? `&from_time=${from_time}&to_time=${to_time}` : ``;
  return api.get(
    `fixed_expenses_get?branch_id=${branch_id}${time}&fixed_expense_id=${expense_id}&page=${page}&limit=${limit}`
  );
}
// variable expenses
export function payForVariableExpense(data) {
  return api.post(`pay_for_variable_expense`, data);
}
export function variableExpenses(branch_id, from_time, to_time, page, limit) {
  let time =
    from_time && to_time ? `&from_time=${from_time}&to_time=${to_time}` : ``;
  return api.get(
    `get_variable_expenses?branch_id=${branch_id}${time}&page=${page}&limit=${limit}`
  );
}
// user expenses
export function userExpenses(user_id, from_time, to_time, page, limit) {
  if (from_time && to_time)
    return api.get(
      `get_user_expenses?user_id=${user_id}&from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`
    );
  else
    return api.get(
      `get_user_expenses?user_id=${user_id}&page=${page}&limit=${limit}`
    );
}
export function payForUser(data) {
  return api.post(`pay_to_user`, data);
}
// party expenses
export function partyExpenses(party_id, page, limit) {
  return api.get(`get_party_expenses/${party_id}?page=${page}&limit=${limit}`);
}
export function payForPartyExpense(data) {
  return api.post(`pay_for_party_expense`, data);
}
// market expenses
export function marketExpenses(market_id, from_time, to_time, page, limit) {
  if (from_time && to_time)
    return api.get(
      `get_market_expenses/${market_id}?from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`
    );
  else
    return api.get(
      `get_market_expenses/${market_id}?page=${page}&limit=${limit}`
    );
}
export function payForMarketExpense(data) {
  return api.post(`pay_for_market_expense`, data);
}

// customers

export function customer(customer_id) {
  return api.get(`get_customer/${customer_id}`);
}
export function customers(search, page, limit) {
  if (search)
    return api.get(
      `get_customers?search=${search}&page=${page}&limit=${limit}`
    );
  else return api.get(`get_customers?page=${page}&limit=${limit}`);
}
export function customerLoan(customer_id) {
  return api.get(`get_customer_loan/${customer_id}`)
}
export function updateCustomer(data) {
  return api.put(`update_customer/${data.id}`, data);
}

// orders

export function order(order_id) {
  return api.get(`get_this_order/${order_id}`);
}
export function orders(
  branch_id,
  from_time,
  to_time,
  status,
  seller_id,
  user_id,
  customer_id,
  page,
  limit
) {
  let time_filter = ``;
  if (from_time && to_time) {
    time_filter = `&from_time=${from_time}&to_time=${to_time}`;
  }
  return api.get(
    `get_orders?branch_id=${branch_id}${time_filter}&status=${status}&seller_id=${seller_id}&user_id=${user_id}&customer_id=${customer_id}&page=${page}&limit=${limit}`
  );
}
export function confirmationOrder(order_id, data) {
  return api.put(`order_confirmation/${order_id}`, data);
}
export function createOrder() {
  return api.post(`create_order`);
}
export function removeOrder(order_id) {
  return api.delete(`remove_order/${order_id}`);
}

// trades

export function toTrade(data) {
  return api.post(`to_trade`, data);
}
export function trades(order_id) {
  return api.get(`get_trades/${order_id}`);
}
export function updateTrade(status, data) {
  return api.put(`update_trade/${status}`, data);
}
export function tradeBalance(order_id) {
  return api.get(`get_trade_balance/${order_id}`);
}

// returned products

export function returnProduct(trade_id, data) {
  return api.put(`return_product/${trade_id}`, data)
}
export function returnedProducts(order_id, page, limit) {
  return api.get(
    `get_returned_products?order_id=${order_id}&page=${page}&limit=${limit}`
  );
}

// incomes

export function incomes(source, status, branch_id, page, limit) {
  return api.get(
    `get_incomes/${source}/${status}?branch_id=${branch_id}&page=${page}&limit=${limit}`
  );
}

// loans

export function loan(order_id, loan_id) {
  return api.get(`get_loan?order_id=${order_id}&loan_id=${loan_id}`);
}
export function loans(status, branch_id, customer_id, page, limit) {
  return api.get(
    `get_loans/${status}?branch_id=${branch_id}&customer_id=${customer_id}&page=${page}&limit=${limit}`
  );
}
export function takeLoan(data) {
  return api.post(`take_loan/${data.id}?money=${data.money}&type=${data.type}`);
}

// products

export function products(
  search,
  category_id,
  branch_id,
  location_id,
  page,
  limit
) {
  return api.get(
    `get_products?search=${search}&category_id=${category_id}&branch_id=${branch_id}&pr_loc_id=${location_id}&page=${page}&limit=${limit}`
  );
}
export function updateProduct(code, data) {
  return api.put(`update_product/${code}`, data);
}
export function productsForTrade(code) {
  return api.get(`get_products_for_trade/${code}`);
}

// product locations

export function productLocations(page, limit) {
  return api.get(`get_product_locations?page=${page}&limit=${limit}`);
}
export function createProductLocation(data) {
  return api.post(`create_product_location`, data);
}
export function updateProductLocation(data) {
  return api.put(`update_product_location/${data.id}`, data);
}
