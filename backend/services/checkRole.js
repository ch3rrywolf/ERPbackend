require("dotenv").config();

/*function checkRoleAdmin(req, res, next) {
  if (res.locals.role !== process.env.ADMIN) res.sendStatus(401);
  else next();
}*/

function checkRoleRH(req, res, next) {
  if (
    res.locals.Role !== process.env.RH &&
    res.locals.Role !== process.env.ADMIN &&
    res.locals.Role !== process.env.SI &&
    res.locals.Role !== process.env.PF &&
    res.locals.Role !== process.env.INGENIEUR
  )
    res.sendStatus(401);
  else next();
}

module.exports = { checkRoleRH: checkRoleRH };
