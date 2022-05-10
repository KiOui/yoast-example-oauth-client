# Yoast Example OAuth client

The purpose of this project is to show how to connect an OAuth client to the OAuth server in the 
[Yoast SEO plugin](https://github.com/Yoast/wordpress-seo). The OAuth server in the Yoast SEO plugin is on a 
[development branch](https://github.com/Yoast/wordpress-seo/pull/18392). This client is build with 
[VueJS](https://vuejs.org) and [TypeScript](https://www.typescriptlang.org) and uses the 
[PKCE extention](https://tools.ietf.org/html/rfc7636) for [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749).

## Project setup
1. Install the [Yarn](https://yarnpkg.com/) package manager
2. Clone this repository
3. Use `yarn install` to install the required packages
4. Use `yarn serve` to serve the test server
5. Note that you might need to setup a `.env` file in the root of the cloned repository. The `.env` file will need to
   look something like the following (for local development):

```
VUE_APP_API_BASE_URI=http://basic.wordpress.test
VUE_APP_API_AUTHORIZATION_ENDPOINT=/wp-admin/admin.php?page=wpseo_oauth_authorize
VUE_APP_API_ACCESS_TOKEN_ENDPOINT=/wp-json/yoast/v1/oauth/access-token
VUE_APP_API_ENDPOINT=/wp-json/yoast/v1/
VUE_APP_API_OAUTH_CLIENT_ID=test-client-identifier
VUE_APP_API_OAUTH_REDIRECT_URI=http://localhost:8080/auth/callback
```

Additionally, a Yoast development environment should be set up with the correct development branch (including the OAuth 
server).