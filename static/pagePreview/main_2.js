console.log("salut")
/// <reference path="../../typings/globals/jquery/index.d.ts" />

//alert('success : ' );

const parser = function(){
    
    $("#pageContent").on('load', function(){

        let fHtml = $("#pageContent").contents().get();

        console.log('frame ', fHtml);

        const nodes = fHtml[0].all;

       console.log('nodes ', nodes);

      const textNodes = Array.from(nodes).filter(function(node){
          /*if(node.firstElementChild==null && node.firstChild!= null && node.nodeName !="SCRIPT" && node.nodeName !="TITLE" && node.nodeName !="STYLE"){
              if(node.firstChild.nodeType == 3){
                console.log('node : ', node);
              }
          }*/
          return node.firstElementChild==null && node.firstChild!= null && node.nodeName !="SCRIPT" && node.nodeName !="TITLE" && node.nodeName !="STYLE" && node.innerText !="" && node.firstChild.nodeType == 3 ;
      })

      console.log("nodes filtred :",textNodes)

      console.log("first element  : ", textNodes[9])
      console.log("first element className : ", textNodes[9].className)
      console.log("first element text : ", textNodes[9].innerText)
      var theColorIs = $(textNodes[9].localName).css('color');
      const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
      console.log("first element text color HEX: |", rgb2hex( theColorIs),"|")
      console.log("first element text color RGBA: |", theColorIs,"|")

      function rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
         ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
       }

       function inlineStyle (prop){
        var styles = this.attr("style"),
             value;
         styles && styles.split(";").forEach(function (e) {
             var style = e.split(":");
             if ($.trim(style[0]) === prop) {
                 value = style[1];           
             }                    
         });   
         return value;
       }

       

       

    })
}

parser()
/*
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

  var dom_nodes = $($.parseHTML(val));


}*/


//getHtmlContent(performSomeAction)

