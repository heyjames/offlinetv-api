const config = require("config");

if (!config.get("oauth_token")
    || !config.get("client_id")
    || !config.get("refresh_token")
    || !config.get("youtube_api_key")
    || !config.get("cors_url")
    ) {
    console.error("Set your environmental variables.");
    process.exit(1);
}

console.log("startup.js loaded...");