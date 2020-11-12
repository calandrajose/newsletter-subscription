require("dotenv").config();
const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");
const server = "us2";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, () =>
  console.log("Server listening on http://localhost:3000")
);
app.use(express.static("public"));

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const jsonData = JSON.stringify(createNewMember(email, firstName, lastName));
  const auth = "comonolaviste" + " " + process.env.API_KEY;
  const url = `https://us2.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;
  const options = setOptions(url, auth, jsonData);

  request(options, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      res.sendFile(__dirname + "/public/failure.html");
    } else {
      res.sendFile(__dirname + "/public/success.html");
    }
  });
});

app.post("/failure", (req, res) => {
    res.redirect("/");
  });

function createNewMember(email, firstName, lastName) {
  return {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
}

function setOptions(url, auth, jsonData) {
  return {
    url: url,
    method: "POST",
    headers: {
      Authorization: auth,
    },
    body: jsonData,
  };
}
