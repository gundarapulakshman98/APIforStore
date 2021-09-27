const express = require("express");
const app = express();
app.use(express.json());

const tax_details = {
  Medicine: 5,
  Food: 5,
  Clothes: [5, 12],
  Music: 3,
  Imported: 18,
  Book: 0,
};
const discount_for_more_than_2000_bill_amount = 5;

const initializeDBAndServer = async () => {
  try {
    app.listen(3000, (request, response) => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
app.get("/", (request, response) => {
  response.send(
    "Server Running at http://localhost:3000/   please try to do it manually and commands are given in README.md file in the files"
  );
});
// we are using this path just for checking case and this api can use and edit for the requirements we need
app.post("/orders/", (request, response) => {
  let commodity_list_name = [];
  let commodity_items_details = {};
  const itemsList = request.body; // we are getting the details of body having a list of items
  const date_time = new Date(); // we used new Date() to get the present date and time
  const date = date_time.toLocaleDateString(); // converts the date_time object into date
  const time = date_time.toLocaleTimeString(); // converts the date_time object into time
  let totalBill = 0;
  let totalTax = 0;
  let totalDiscountAmount = 0;
  for (let itemDetails of itemsList) {
    const { item, quantity, itemCategory, price } = itemDetails;
    let item_tax = 0;
    let total_price = quantity * price;
    let tax_amount_per_item = 0;
    // as we know that clothes item are differ in their tax percentage if their price varies
    if (itemCategory === "Clothes") {
      if (price < 1000) {
        item_tax = tax_details["Clothes"][0];
      } else {
        item_tax = tax_details["Clothes"][1];
      }
    } else {
      item_tax = tax_details[itemCategory];
    }
    tax_amount_per_item = (total_price / 100) * item_tax;
    total_price = total_price + tax_amount_per_item;
    totalBill += total_price;
    totalTax += tax_amount_per_item;
    commodity_list_name.push(item);
    const item_details = {
      item,
      final_price: total_price,
      tax_amount: tax_amount_per_item,
      tax_percentage: item_tax,
      date,
      time,
    };
    commodity_items_details[item] = item_details;
  }
  console.log(totalBill);
  console.log(totalTax);
  if (totalBill > 2000) {
    totalDiscountAmount =
      (totalBill / 100) * discount_for_more_than_2000_bill_amount;
    totalBill -= totalDiscountAmount;
  }
  commodity_list_name.sort();

  console.log(`Final Bill Amount : ${totalBill}`);
  console.log(`Final Tax Amount  : ${totalDiscountAmount}`);
  for (const item of commodity_list_name) {
    console.log(commodity_items_details[item]);
  }
  response.send(commodity_items_details);
  // here we are sending the data that required
});
