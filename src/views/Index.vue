<template>
  <div class="container text-center">
    <h1 class="font-oswald mt-5 text-center">Yoast OAuth client</h1>
    <div v-if="authenticated">
      You are currently logged in.
      <a href="#" @click="logOut">Logout</a>
      <ul style="list-style-type: none">
        <li><strong>Access token</strong>: {{ accessToken }}</li>
        <li><strong>Refresh token</strong>: {{ refreshToken }}</li>
        <li><strong>Expires in</strong>: {{ expiresIn }}</li>
      </ul>
      <a href="#" @click="requestNewAccessToken">Request new access token</a>
    </div>
    <div v-else>
      <p>You are not logged in yet. Please login first.</p>
      <div class="d-flex justify-content-center align-items-center mt-5">
        <a
          href="#"
          class="login-btn btn btn-primary d-block"
          @click="startLogin"
        >
          Login with
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="true"
            viewBox="0 0 500 500"
            width="20px"
            height="20px"
          >
            <defs></defs>
            <defs>
              <linearGradient
                id="a"
                x1="250"
                x2="250"
                y1="428.61"
                y2="77.12"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#570732"></stop>
                <stop offset=".02" stop-color="#5d0936"></stop>
                <stop offset=".16" stop-color="#771549"></stop>
                <stop offset=".3" stop-color="#8b1d58"></stop>
                <stop offset=".47" stop-color="#992362"></stop>
                <stop offset=".67" stop-color="#a12768"></stop>
                <stop offset="1" stop-color="#a4286a"></stop>
              </linearGradient>
              <linearGradient
                id="b"
                x1="266.57"
                x2="266.57"
                y1="-6.97"
                y2="378.46"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#77b227"></stop>
                <stop offset=".47" stop-color="#75b027"></stop>
                <stop offset=".64" stop-color="#6eab27"></stop>
                <stop offset=".75" stop-color="#63a027"></stop>
                <stop offset=".85" stop-color="#529228"></stop>
                <stop offset=".93" stop-color="#3c8028"></stop>
                <stop offset="1" stop-color="#246b29"></stop>
              </linearGradient>
            </defs>
            <g style="isolation: isolate">
              <path
                fill="url(#a)"
                d="M454.74 428.61h-336.3a73.39 73.39 0 01-73.18-73.17V150.3a73.39 73.39 0 0173.18-73.18h263.12a73.39 73.39 0 0173.18 73.18z"
              ></path>
              <path
                fill="#a4286a"
                d="M357.12 102.42l-43.77 9.38L239.88 277l-47.2-147.83h-70.2l78.59 201.89a73.58 73.58 0 010 53.45c-6.72 17.25 45.13-84.13 24.75-75.74 0 0 34.87 97.63 36.39 94.54a464.9 464.9 0 0020.17-48.47L387.37 72s-28.95 30.42-30.25 30.42z"
              ></path>
              <path
                fill="url(#b)"
                d="M337 6.14L238.44 279.9l-47.2-147.83H121L199.63 334a73.58 73.58 0 010 53.45c-8.79 22.53-23.41 41.81-59 46.6v59.85c69.38 0 106.88-42.65 140.35-136.12L412.1 6.14z"
              ></path>
              <path
                fill="#fff"
                d="M140.59 500h-6.14v-71.37l5.32-.71c34.84-4.68 46.92-24.23 54.13-42.74a67.32 67.32 0 000-49l-81.85-210.25h83.68l43.06 134.87L332.68 0h88.26L286.69 359.88c-17.88 49.95-36.35 83.44-58.11 105.3C205 488.94 177 500 140.59 500zm6.14-60.75v48.35c29.94-1.18 53.31-11.14 73.15-31.08 20.43-20.54 38-52.59 55.27-100.85l128.1-343.39h-61.94L238.09 299l-51.34-160.79H130l75.34 193.52a79.56 79.56 0 010 57.91c-7.66 19.66-21.26 42.75-58.61 49.61z"
              ></path>
            </g>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import ApiService from "@/common/api.service";

export default {
  name: "Index",
  computed: {
    ...mapGetters({
      authenticated: "User/isLoggedIn",
      accessToken: "User/accessToken",
      refreshToken: "User/refreshToken",
      expiresIn: "User/expiresIn",
    }),
  },
  methods: {
    async startLogin() {
      await store.dispatch("User/newRandomState");
      await store.dispatch("User/newRandomChallenge");
      await store.dispatch("User/store");
      ApiService.getAuthorizeRedirectURL().then((url) => {
        window.location.href = url;
      });
    },
    async requestNewAccessToken() {
      const refreshToken = store.getters["User/refreshToken"];
      if (refreshToken !== null) {
        ApiService.getAccessTokenFromRefreshToken(refreshToken).then(
          (credentials) => {
            store
              .dispatch("User/login", {
                stateKey: null,
                accessToken: credentials.data.access_token,
                refreshToken: credentials.data.refresh_token,
                expires: Date.now() + credentials.data.expires_in * 1000,
                tokenType: credentials.data.token_type,
              })
              .then((loggedIn) => {
                if (!loggedIn) {
                  alert("State token did not match, please try again...");
                } else {
                  store.dispatch("User/store");
                }
              });
          }
        );
      }
    },
    async logOut() {
      await store.dispatch("User/logout");
      await store.dispatch("User/store");
    },
  },
};
</script>

<style scoped></style>
