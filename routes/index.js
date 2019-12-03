const questions = require("../public/question");
const easy = questions.easy;
// const num = Math.floor(Math.random() * easy.length);
// console.log(num);
// console.log(easy.length);

const qkey = getRandom(easy,3);

//Picking random 3 easy questions
function getRandom(arr, n) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const constructorMethod = app => {

    app.get("*", async (req, res) => {     
      console.log(questions)
      res.render("layouts/main", qkey);

    });
  };
  
  module.exports = constructorMethod;