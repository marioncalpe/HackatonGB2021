console.log("salut")
//alert('success : ' );



var HTMLStr;
var val;

function getHtmlContent(callback) {
  var req1 = new XMLHttpRequest();
  const url = 'static/pagePreview/temp.html' // provide file location
  req1.open("GET", url);
  req1.send("");

  req1.onreadystatechange= function () {
      if (req1.readyState == 4 && req1.status == 200) {
          HTMLStr = req1.responseText;
          //console.log(HTMLStr)
          //fire your callback function
          callback.apply(this,[HTMLStr]);
      } else {

      }
  };
}

var performSomeAction = function(returned_data) {
  val = returned_data;

  //alert("My HTML : "+ val);

  let parser = new DOMParser();
  let parsedHtml = parser.parseFromString(val, 'text/html');


  /*
  const p_length = parsedHtml.querySelectorAll("a").length;

  for (let i = 0; i < p_length; i++) {
    const a = parsedHtml.querySelectorAll("a")[i];
    var y = a.childNodes[i];
    
    if(y.textContent !==null ){
          var z = y.textContent;
          console.log(a); // element list
          console.log("-----------------------------------------"); // element list
          console.log(z); // element list
      }
  }*/

    const allElements = parsedHtml.getElementsByTagName("*");
    const allTagNames = new Set([].map.call(allElements, el => el.nodeName.toLowerCase()));
    
    for (var elem in allElements) {
      if (elem.innerHTML !="") {
        console.log("Elem :"+elem);
    } else {
        // element is empty
    }
   }

    //console.log(allElements)



}

function getTextElements() {

}


getHtmlContent(performSomeAction)






/*

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      //console.log(xhr.responseText);
      htmlStr = xhr.responseText;
      //alert("My HTML : "+ htmlStr);


      let parser = new DOMParser();
      let parsedHtml = parser.parseFromString(htmlStr, 'text/html');

      let imgUrl = parsedHtml.images[0].src;
      //alert("image: "+ firstImg);


      
   }};



xhr.send();
*/
