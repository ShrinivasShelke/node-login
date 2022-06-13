const express = require("express");
const bodyPaser = require("body-parser");
const bcrypt = require("bcrypt");
const { PORT } = require("./config/index");
const loginRoutes = require("./routes/user.routes");
const db = require("./models");
const HttpError = require("./utils/http-error");
const User = db.user;

const app = express();

app.use(bodyPaser.urlencoded({ extended: false }));
app.use(bodyPaser.json());

app.use("/", loginRoutes);
db.sequelize.sync();

app.listen(PORT, async () => {
  console.log("server is running on 3000");
  try {
    const existingUser = await User.findOne({ where: { username: "admin" } });
    if (existingUser) {
      return;
    } else {
      let hashedPass;
      try {
        hashedPass = await bcrypt.hash("admin", 12);
      } catch (err) {
        const error = new HttpError(
          "Could not create user, please try again.",
          400
        );
        return error;
      }

      // Create a User
      const user = {
        username: "admin",
        email: "admin@admin.com",
        password: hashedPass,
      };

      // Save User in the database
      User.create(user)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log({
            message:
              err.message || "Some error occurred while creating the user.",
          });
        });
    }
  } catch (err) {
    console.log({
      message: err.message || "Some error occurred while creating the user.",
    });
  }
});
