//access mongodb

const fs = require("fs");
let rawdata = fs.readFileSync("./users.json");
let users = JSON.parse(rawdata);

const express = require("express");
const app = express();
const port = 3000;
app.locals.title = "MINGO";
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/user/:id", (req, res) => {
  let { id } = req.params;
  console.log("id is", id);
  let user = users.filter((user) => id == user.user_id)[0];
  console.log(user);
  res.send(`<h1>User ${req.params.id}</h1><a href="/users">Users</a>`);
});

app.get("/users", (req, res) =>
  res.send(`<main>
<p><a href="/user/1">1</a></p>
<p><a href="/user/2">2</a></p>
<p><a href="/user/3">3</a></p>
</main><a href="/">Home</a>`)
);

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.post("/add_user", (req, res) => {
  let { email, name, lastname } = req.body;
  let created_at = new Date().toISOString();
  let updated_at = created_at;
  let user_id = users.length + 1;
  let new_user = {
    user_id,
    email,
    given_name: name,
    family_name: lastname,
    created_at,
    updated_at,
    email_verified: false,
  };
  console.log(new_user);
  if (new_user) {
    users.push(new_user); //add some data
    console.log(users);
    json = JSON.stringify(users); //convert it back to json
    fs.writeFile("./users.json", json, function (err) {
      if (err) throw err;
      console.log("complete");
    }); // write it back
  }
  res.render("pages/add_user");
});
app.post("/user_list", (req, res) => {
  let name = req.body.name;
  let id = req.body.id;
  if (req.body.delete) {
    let user = users.filter((users) => !(id == users.user_id));
    
    
  } else if (req.body.update) {
    upd_obj = users.findIndex((users) => users.user_id == id);
    console.log("to modify", upd_obj);
    users[upd_obj].given_name = name;
    console.log("modified", users[upd_obj]);
    user=users
   // users[user_id == id].given_name = name; // là où l'id du form est égal au user id du json on change le prénom
  }
  json = JSON.stringify(user); //convert it back to json
  fs.writeFile("./users.json", json, function (err) {
    if (err) throw err;
    console.log("complete");
  }); // write it back
  res.render("pages/user_list", { users });
});
app.get("/add_user", (req, res) => res.render("pages/add_user"));
app.get("/user_list", (req, res) => {
  res.render("pages/user_list", { users });
});

app.listen(port, () => console.log(""));
