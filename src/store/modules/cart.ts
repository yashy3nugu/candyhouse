import { createSlice } from "@reduxjs/toolkit";
import { CartCandy } from "../types";

interface CartState {
  items: CartCandy[];
  value: number;
  price: number;
}

const initialState: CartState = {
  items: [],
  price: 0,
  value: 0,
};

export const appSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCandyToCart: (state, action) => {
      const cartArr = [...state.items];

      if (cartArr.find((candy) => candy._id === action.payload.candy._id)) {
        const candyIndex = cartArr.findIndex(
          (candy) => candy._id === action.payload.candy._id
        );
        cartArr[candyIndex]!.itemsInCart++;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        cartArr.push({
          ...(action.payload.candy),
          itemsInCart: 1,
        });
      }

      //   const cartPrice = state.price + (action.payload.candy.price as number);
      let cartPrice = 0;

      for (const item of cartArr) {
        cartPrice += item.price * item.itemsInCart;
      }

      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: cartArr,
          price: cartPrice,
          value: state.value + 1,
        })
      );

      state.items = cartArr;
      state.price = cartPrice;
      state.value = state.value + 1;
    },
    removeCandyFromCart: (state, action) => {
      const cartArr = [...state.items];

      // if burger already exists
      if (cartArr.find((candy) => candy._id === action.payload.candy._id)) {
        const candyIndex = cartArr.findIndex(
          (candy) => candy._id === action.payload.candy._id
        );

        if (candyIndex !== -1) {
          if (cartArr[candyIndex]!.itemsInCart > 1) {
            cartArr[candyIndex]!.itemsInCart--;
          } else {
            cartArr.splice(candyIndex, 1);
          }
        }
      }

      let cartPrice = 0;

      for (const item of cartArr) {
        cartPrice += item.price * item.itemsInCart;
      }

      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: cartArr,
          price: cartPrice,
          value: state.value - 1,
        })
      );

      state.items = cartArr;
      state.price = cartPrice;
      state.value = state.value - 1;
    },
    removeCandyInstancesFromCart: (state, action) => {
      const cartArr = [...state.items];

      if (cartArr.find((candy) => candy._id === action.payload.candy._id)) {
        const candyIndex = cartArr.findIndex(
          (burger) => burger._id === action.payload.candy._id
        );

        cartArr.splice(candyIndex, 1);
      }

      let cartPrice = 0;

      for (const item of cartArr) {
        cartPrice += item.price * item.itemsInCart;
      }

      const cartValue = state.value - action.payload.candy.itemsInCart;

      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: cartArr,
          price: cartPrice,
          value: cartValue,
        })
      );

      state.items = cartArr;
      state.price = cartPrice;
      state.value = cartValue;
    },
    clearCart: (state) => {
      state.items = [];
      state.price = 0;
      state.value = 0;

      localStorage.removeItem("cart");
    },
    initCart: (state) => {
      const cart = JSON.parse(localStorage.getItem("cart") || "{}");

      state.items = cart.items || [];
      state.price = cart.price || 0;
      state.value = cart.value || 0;
    },
  },
});

export const {
  addCandyToCart,
  removeCandyFromCart,
  removeCandyInstancesFromCart,
  clearCart,
  initCart,
} = appSlice.actions;

export default appSlice.reducer;
