(function() {

    const staticForm = document.getElementById("ansScore");
    //const check = document.getElementsByName();
    staticForm.addEventListener("submit", event => { 
    event.preventDefault();
    var node = document.createElement("li")
    var text = " You clicked!"
    var textNode = document.createTextNode(text);
    node.appendChild(textNode); 
    document.getElementById("Status").appendChild(node);
    });
})();