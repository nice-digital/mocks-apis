const app = require("./app.js");

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Mock search api running at http://localhost:${port}`);
});
