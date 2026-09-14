export const apiConfig = {
  endpoints: {
    signup: "/signup",
    login: "/login",
    product: "/view",
    addToCart: "/addtocart",
    viewCart: "/viewcart",
    deleteCart: "/deletecart",
  },
  response: {
    authToken: "Auth_token",
    cartKeys: ["Items", "items", "cart", "Cart", "products"],
  },
  defaults: {
    flag: true,
    expectedStatus: 200,
    pollingInterval: 1000,
    pollingTimeout: 15000,
  },
  allure: {
    signup: "Signup Response",
    login: "Login Response",
    product: "Product Response",
    addToCart: "Add To Cart Response",
    viewCart: "View Cart Response",
    deleteCart: "Delete Cart Response",
  },
} as const;
