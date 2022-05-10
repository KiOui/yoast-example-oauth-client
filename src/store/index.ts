import { createStore } from "vuex";
import User from "./modules/user.module";

export default createStore({
  modules: {
    User,
  },
});
