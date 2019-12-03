(function() {
    console.log("Inside Script")
    fetch('/public/question.json').then(function (response) { return response.json();})
        .then(function (data) { console.log("Getting JSON"); appendData(data);})
            .catch(function (err) { console.log('error: ' + err);});

    function appendData(data) 
    {
        // var mainContainer = document.getElementById("Questions");
        // console.log("Inside fn");
        // for (var i = 0; i < data.length; i++) 
        // {
        //     console.log("Inside ques")
        //     var node = document.createElement("li")
        //     var text = 'Question: ' + data[i].question + 'Options: ' + data[i].firstOp + ' ' + data[i].secondOp;
        //     var textNode = document.createTextNode(text);   
        //     node.appendChild(textNode); 
        //     mainContainer.appendChild(node);

        //     // var div = document.createElement("div");
        //     // div.innerHTML = 'Question: ' + data[i].question + 'Options: ' + data[i].firstOp + ' ' + data[i].secondOp;
        //     // mainContainer.appendChild(div);
        // }
    }
})();
