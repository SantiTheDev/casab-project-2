const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const { mongoose } = require("./database");
const cors = require("cors");

//body capture
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// import routes
const authRoutes = require("./routes/auth.js");

app.use(express.json());

// route middlewares
const corsOptions = { origin: "*" };
const configureCors = cors(corsOptions);
app.options("*", configureCors);
app.use("/api/user", configureCors, authRoutes);
app.use('/api/roles', configureCors, require('./routes/roles'))

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server running on: ${PORT}`);
});
