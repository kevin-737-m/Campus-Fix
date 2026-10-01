const app = require("./src/app");
const connectdb = require('./src/db/db');

connectdb()
    .then(()=> {
    app.listen(3000, () => {
        console.log("Server is Started");
    })
});