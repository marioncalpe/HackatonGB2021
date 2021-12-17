console.log("salut")
/// <reference path="../../typings/globals/jquery/index.d.ts" />

//alert('success : ' );

const parser =  function(){
    
    $("#pageContent").on('load', async function(){

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

      var data = new Array();
      for (let i = 0; i < textNodes.length; i++) {

        mystyle = getComputedStyle(textNodes[i]);
        textcolor = mystyle['color'];

        var bgColor = getComputedBG(textNodes[i]);

        var ratio= await apiRequest(rgb2hex(textcolor), rgb2hex(bgColor)).then(function (value) {
          return value
        })

        data[i] = {
          "node" : textNodes[i],
          "text-color" : rgb2hex(textcolor),
          "bg-color" : rgb2hex(bgColor),
          "ratio":  ratio
        }
      }

      console.log("MY ARRAY ",data)

      async function apiRequest(foreground, background) {
        const apiUrl = "https://webaim.org/resources/contrastchecker/?fcolor="+foreground+"&bcolor="+background+"&api";
        var result = 0.;
        await $.ajax({
            url: apiUrl,
            method: 'GET',
            accept: 'application/json',
            success: function(response) {
                result = response.ratio;
            }
        }).fail(function() {
            result = -1
        })

        return result
    }

      console.log("nodes filtred :",textNodes)

      console.log("first element  : ", textNodes[4])
      //console.log("first element className : ", textNodes[9].className)
      console.log("first element text : ", textNodes[4].innerText)
      var bgColor = getComputedBG(textNodes[4]);
      mystyle = getComputedStyle(textNodes[4]);
      //alert(mystyle['color']);
      var theColorIs = mystyle['color'];
      var bg_color = mystyle['background-color'];
      const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
      console.log("first element text color HEX: |", rgb2hex( theColorIs),"|")
      console.log("first element text color RGBA: |", theColorIs,"|")
      console.log("BG Color |",rgb2hex(bgColor),"|")

      function rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
         ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
       }

       function getComputedBG(node){
          bg = $(node).css('background-color') 

          var strFirstThree = bg.substring(0,4);
          var lastChar = strFirstThree.substr(strFirstThree.length - 1);
          console.log("Alpha  :",getAlpha($(node).css('background-color')))

          if(lastChar=="a"){
          }
          if($(node).css('background-color') !=" undefined " && getAlpha($(node).css('background-color')) == 1){
               return $(node).css('background-color');
          }else{
            return getComputedBG(node.parentNode);
          }
       }

       function getAlpha(str){
        let regex = /^rgba\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3},\s?([0-9]\.?[0-9]*)\)$/,
        result = 1;
    
          if(regex.test(str)) {
            let match = str.match(regex);
            result = match[1];
          }
          return result
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

