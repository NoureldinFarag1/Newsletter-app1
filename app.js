const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const data = {
    members: [{
      email_address: req.body.email,
      status: "subscribed",
      merge_fields: {
        FNAME: req.body.fname,
        LNAME: req.body.lname
      }
    }]
  }
  const options = {
    method: "POST",
    auth: "apikey:1aa8c3eeec7c79b8ca4ac1ad22e66beb-us14"
  }
  const jsonData = JSON.stringify(data);
  const mailchimpUrl = "https://us14.api.mailchimp.com/3.0/lists/4d8e194ca5";

  const httpRequest = https.request(mailchimpUrl, options, function(httpResponse) {
    if (httpResponse.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    httpResponse.on("data", function(data) {
      // res.sendFile(__dirname + "/success.html");
      console.log(JSON.parse(data));
    });
  });

  // httpRequest.on("error", error => {
  //   res.sendFile(__dirname + "/failure.html");
  // });

  httpRequest.write(jsonData);
  httpRequest.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.")
});
