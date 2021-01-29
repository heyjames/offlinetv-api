if (!process.env.OAUTH_TOKEN
    || !process.env.CLIENT_ID
    || !process.env.REFRESH_TOKEN
    || !process.env.YOUTUBE_API_KEY
    ) {
    console.error("Set your environmental variables.");
    process.exit(1);
}

console.log("startup.js loaded...");