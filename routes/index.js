
const questions = require("../public/question");
//const easy = questions.easy
const constructorMethod = app => {

    app.get("*", async (req, res) => {     
      console.log(questions)
      res.render("layouts/main", questions.easy);

    });
  };
  
  module.exports = constructorMethod;
