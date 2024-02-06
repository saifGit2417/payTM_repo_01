import { atom } from "recoil";
export const AuthTokenAtom = atom({
  key: "AuthTokenAtom",
  default: localStorage.getItem("auth_token"),
});
