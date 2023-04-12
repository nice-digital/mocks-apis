const app = require("./app.js");

// const port = process.env.PORT || 80;
const port = 12346;

app.listen(port, () => {
  console.log(`Mock search api running at http://localhost:${port}`);
});
