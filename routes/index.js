const questions = require("../public/question");
const easy = questions.easy;
// const num = Math.floor(Math.random() * easy.length);
// console.log(num);
// console.log(easy.length);
const medium = questions.medium;
const hard = questions.hard;

let qkey = getRandom(easy,1);
qkey.push.apply(qkey, getRandom(medium,1));
qkey.push.apply(qkey, getRandom(hard,1));

const key = qkey;

let anskey = [];

console.log("QUES")
for(let i = 0; i<3; i++)
{
  console.log(key[i].question);
  console.log(key[i].answer);
  anskey.push(key[i].answer);
}
console.log("ANSWER")
for(let i = 0; i<3; i++)
{
  console.log(anskey[i]);
}

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
      //console.log(req.body);
      let arr = req.body.question;
      let ans = [];  //marked options
      let score = 0;  //generated score
      for(let i = 0; i<3; i++)
      {
        //console.log(arr[i] + " " + req.body[arr[i]]);
        ans.push(req.body[arr[i]]); //marked answers
      }
      // console.log("ANSWERed")
      // for(let i = 0; i<3; i++)
      // {
      //   console.log(ans[i]);
      // }
      for(let i = 0; i<3; i++)
      {
        if(ans[i] == anskey[i]) {score++;} //comparing rights options to the marked options
      }
      console.log("SCORE =  " +score);
      //check for 3 checked radio before generatiom, unmarked is counted as zero
    });
  };
  
  module.exports = constructorMethod;