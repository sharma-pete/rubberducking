const questions = require("../public/question");
const easy = questions.easy;
// const num = Math.floor(Math.random() * easy.length);
// console.log(num);
// console.log(easy.length);

let qkey = getRandom(easy,1);
qkey.push.apply(qkey, getRandom(medium,1));
qkey.push.apply(qkey, getRandom(hard,1));

const key = qkey;

//Picking random 3 easy questions
//function to randomly generate subarray of any array with n number of random elements
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
      res.render("layouts/main", key);

    });

    app.post("*", async (req, res) => {     
      console.log(req.body);
      let arr = req.body;
      for(let i = 0; i<12; i++)
      {console.log(arr[i]);}
      //check for 3 checked radio before generatiom
    });
  };
  
  module.exports = constructorMethod;