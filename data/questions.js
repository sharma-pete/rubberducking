const questions = require("./questions.json")

async function genQuiz(){

    easyQuestions = questions.easy
    mediumQuestions = questions.medium
    hardQuestions = questions.hard

    let questionArr = []

    for(i=0;i<4;i++){
        rand = Math.random() * easyQuestions.length
        if(questionArr.includes(easyQuestions[Math.floor(rand)])){
            i = i - 1
            continue
        }
        else{
            questionArr.push(easyQuestions[Math.floor(rand)])
        }
    }

    for(i=0;i<4;i++){
        rand = Math.random() * mediumQuestions.length
        if(questionArr.includes(mediumQuestions[Math.floor(rand)])){
            i = i - 1
            continue
        }
        else{
            questionArr.push(mediumQuestions[Math.floor(rand)])
        }
    }

    for(i=0;i<2;i++){
        rand = Math.random() * hardQuestions.length
        if(questionArr.includes(hardQuestions[Math.floor(rand)])){
            i = i - 1
            continue
        }
        else{
            questionArr.push(hardQuestions[Math.floor(rand)])
        }
    }

    let finalQuestionArr = []

    for(i=0;i<questionArr.length;i++){
        pushObj = {
            "id":questionArr[i].id,
            "question":questionArr[i].question,
            "options":questionArr[i].options
        }
        finalQuestionArr.push(pushObj)
    }

    return finalQuestionArr
}

// $(function(){

//     data= await genQuiz()

//     $('#quiz-div').append(data)
// })

async function checkQuiz(){

}

async function main(){
    console.log(await genQuiz())
}
main()
