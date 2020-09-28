module.exports = {
    apps : [{
        name: "Raid-Manager API",
        script: "./server.js",
        node_args: '-r dotenv/config',
        env: {
            NODE_ENV: "development"
        },
        env_production: {
            NODE_ENV: "production"
        }
    }]
}