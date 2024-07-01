const express = require("express");
var cors = require("cors");

const SessionRoute = require("./routes/session");
const EmployeeRoute = require("./routes/employee");
const DashboardRoute = require("./routes/dashboard");
const InfoBankRoute = require("./routes/infosbancaires");
const ContratRoute = require("./routes/contrat");
const PointageRoute = require("./routes/pointage");
const BlogRoute = require("./routes/blogs");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/session", SessionRoute);
app.use("/RH/Employee", EmployeeRoute);
app.use("/RH/Dashboard", DashboardRoute);
app.use("/RH/InfoBank", InfoBankRoute);
app.use("/RH/Contrat", ContratRoute);
app.use("/RH/Pointage", PointageRoute);
app.use("/RH/Blog", BlogRoute);

module.exports = app;
