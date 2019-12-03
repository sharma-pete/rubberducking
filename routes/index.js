
const questions = require("../public/question");

const constructorMethod = app => {

    app.get("*", async (req, res) => {     
      console.log(questions)
      res.render("layouts/main", questions);

    });
  };
  
  module.exports = constructorMethod;
