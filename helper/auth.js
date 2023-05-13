import axios from "axios";
import { useRouter } from "next/router";
import { API_URL } from "./API";

export const signin = async (user) => {
  let res = await axios.post(
    `${API_URL}auth/local`,
    {
      identifier: user.email,
      password: user.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

export const isAdmin = async (token) => {
  let res = await axios.get(`${API_URL}users/me?populate=*`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  localStorage.setItem("seller", JSON.stringify(res.data.seller_account));
  return res;
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

export const getSellerData = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("seller")) {
    return JSON.parse(localStorage.getItem("seller"));
  } else {
    return false;
  }
};

export const authenticate = (data, next) => {
  console.log(data);
  console.log("I'm done!");
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};
