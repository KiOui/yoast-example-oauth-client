<template>
  <div class="container authorize mt-5 text-center">
    <h1 class="font-oswald">Authorization in progress...</h1>
    <p>
      You will be redirected shortly, if redirection fails, please click
      <router-link :to="{ name: 'Index' }">here</router-link>
    </p>
    <div class="d-flex justify-content-center align-items-center">
      <Loader size="60px" background-color="#000000"></Loader>
    </div>
  </div>
</template>

<script type="ts">
import store from "@/store";
import router from "@/router";
import Loader from "@/components/Loader";
import ApiService from "@/common/api.service";

export default {
  name: 'AuthorizationScreen',
  components: {
    Loader
  },
  methods: {
    async authorize() {
      try {
        const url = new URL(window.location);
        if (url.searchParams.get("error")) {
          alert(`Authorization failed: ${url.searchParams.get("error")}`);
        }
        else {
          let credentials = await ApiService.getAccessTokenFromAuthorizationCode(url.searchParams.get("code"));

          await store.dispatch("User/login", {
            stateKey: url.searchParams.get("state"),
            accessToken: credentials.data.access_token,
            refreshToken: credentials.data.refresh_token,
            expires: Date.now() + (credentials.data.expires_in * 1000),
            tokenType: credentials.data.token_type,
          }).then(loggedIn => {
            if (!loggedIn) {
              alert("State token did not match, please try again...");
            } else {
              store.dispatch("User/store");
            }
          });
        }
      } catch (e) {
        alert("Authorization failed, please try again...");
      }
      await router.push({ name: "Index" });
    }
  },
  mounted () {
      this.authorize();
    }
  }
</script>
