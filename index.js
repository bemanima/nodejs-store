const Application = require("./app/server");

new Application("mongodb://127.0.0.1:27017/storeDB", 3000);
