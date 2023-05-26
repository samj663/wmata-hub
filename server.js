const app = require("./backend");

app.listen(process.env.PORT || 3001, () => console.log("server starting on port 3001!"));