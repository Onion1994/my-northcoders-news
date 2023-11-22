const app = require("./app")
const seed = require("./db/seeds/seed")
const data = require("./db/data/development-data/index")

seed(data)

app.listen(9090, () => {
  console.log("listening on 9090")
})
