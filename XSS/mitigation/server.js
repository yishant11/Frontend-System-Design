const express = require("express");

const port = 3003;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use((req,res,next) => {
//   // setting our custom CSP HEADER
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self'; script-src 'self';" + 
//     "script-src 'self' 'nonce-randomKey' 'unsafe-inline' http://unsecure.com;"
//   )
//   next();
// });
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'nonce-randomKey' http://unsecure.com;"
  )
  next();
});


app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log("Server is running at port ", port);
})
