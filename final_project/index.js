const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if session contains authorization with accessToken
  if (req.session?.authorization?.accessToken) {
    const token = req.session.authorization.accessToken;

    // Verify the JWT token
    jwt.verify(token, "access", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
      req.user = decoded; // Attach decoded payload to request
      next();
    });

  } else {
    return res.status(401).json({ message: "No authorization token found" });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
