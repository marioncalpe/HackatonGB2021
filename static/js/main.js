console.log("salut")
//alert('success : ' );
$.get("./../pagePreview/temp.html", "", function(data){
    alert('success : ' + data);
    });

var markup = document.documentElement.innerHTML;

var parser = new DOMParser();
var htmlDoc = parser.parseFromString(txt, 'text/html');
htmlDoc.getElementById("someID");