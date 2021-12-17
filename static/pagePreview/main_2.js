console.log("salut")
/// <reference path="../../typings/globals/jquery/index.d.ts" />

//alert('success : ' );

var w_data = new Array();
var moy
var myTxtNodes

const parser =  function(){
    
    $("#pageContent").on('load', function(){

        let fHtml = $("#pageContent").contents().get();

        //console.log('frame ', fHtml);

        const nodes = fHtml[0].all;

      // console.log('nodes ', nodes);

      const textNodes = Array.from(nodes).filter(function(node){
          /*if(node.firstElementChild==null && node.firstChild!= null && node.nodeName !="SCRIPT" && node.nodeName !="TITLE" && node.nodeName !="STYLE"){
              if(node.firstChild.nodeType == 3){
                console.log('node : ', node);
              }
          }*/
          return node.firstElementChild==null && node.firstChild!= null && node.nodeName !="SCRIPT" && node.nodeName !="TITLE" && node.nodeName !="STYLE" && node.innerText !="" && node.firstChild.nodeType == 3 ;
      })
      myTxtNodes = textNodes
      var data = new Array();
      var percArray = new Array();

      for (let i = 0; i < textNodes.length; i++) {

        mystyle = getComputedStyle(textNodes[i]);
        textcolor = mystyle['color'];

        var bgColor = getComputedBG(textNodes[i]);

        /*var ratio= await apiRequest(rgb2hex(textcolor), rgb2hex(bgColor)).then(function (value) {
          return value
        })*/
        var ratio = contrast(rgb2hex(textcolor),rgb2hex(bgColor))
        var perc = (ratio*100)/21
        percArray.push(perc)
        data[i] = {
          "node" : textNodes[i],
          "text-color" : rgb2hex(textcolor),
          "bg-color" : rgb2hex(bgColor),
          "ratio":  perc
        }
      }

      w_data = data
      console.log("MY ARRAY ",data)
      var total = 0;
      for(var i = 0; i < percArray.length; i++) {
          total += percArray[i];
      }
      var avg = total / percArray.length;
      avg = avg.toFixed(2);
      moy = avg
      
      console.log("MY MOY ",avg)

    function luminance(r, g, b) {
        var a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928
                ? v / 12.92
                : Math.pow( (v + 0.055) / 1.055, 2.4 );
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    function contrast(rgb1, rgb2) {
        var lum1 = luminance(hexToRgb(rgb1).r, hexToRgb(rgb1).g, hexToRgb(rgb1).b);
        var lum2 = luminance(hexToRgb(rgb2).r, hexToRgb(rgb2).g, hexToRgb(rgb2).b);
        var brightest = Math.max(lum1, lum2);
        var darkest = Math.min(lum1, lum2);
        return (brightest + 0.05)
             / (darkest + 0.05);
    }

    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }


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

    /*
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
      console.log("BG Color |",rgb2hex(bgColor),"|")*/

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
          //console.log("Alpha  :",getAlpha($(node).css('background-color')))

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

       
       //OUTPUT
      
      let progressEl = $('.ui.progress .bar')[0];
      progressEl.style.width = moy+"%";
      progressEl.children[0].innerText = moy+"%";
       
      let links = w_data.filter(row => row.node.nodeName == 'A'),
          h1 = w_data.filter(row => row.node.nodeName == 'H1'),
          h2 = w_data.filter(row => row.node.nodeName == 'H2'),
          h3 = w_data.filter(row => row.node.nodeName == 'H3'),
          p = w_data.filter(row => row.node.nodeName == 'P');

      var avrLinks = 0;
      var avrH1 = 0;
      var avrH2 = 0;
      var avrH3 = 0;
      var avrP = 0;
      for (const l of links) {
        avrLinks += l.ratio;
      }
      for (const l of h1) {
        avrH1 += l.ratio;
      }
      for (const l of h2) {
        avrH2 += l.ratio;
      }
      for (const l of h3) {
        avrH3 += l.ratio;
      }
      for (const l of p) {
        avrP += l.ratio;
      }
      
      avrLinks = avrLinks/links.length;
      avrH1 = avrH1/h1.length;
      avrH2 = avrH2/h2.length;
      avrH3 = avrH3/h3.length;
      avrP = avrP/p.length;

      document.getElementById('a').innerText = Math.floor(avrLinks) + "%";
      document.getElementById('h1').innerText = Math.floor(avrH1) + "%";
      document.getElementById('h2').innerText = Math.floor(avrH2) + "%";
      document.getElementById('h3').innerText = Math.floor(avrH3) + "%";
      document.getElementById('p').innerText = Math.floor(avrP) + "%";
    })
}


parser()

reFormHtmlFile = function(){
  $("#pageContent").on('load', function(){

          let fHtml = $("#pageContent").contents().get();

          console.log('frame ', fHtml);

          const nodes = fHtml[0].all;

          //console.log('nodes ', nodes);

          console.log("My nodes length", myTxtNodes.length)

          for (let i = 0; i < nodes.length; i++) {
            for (let j = 0; j < myTxtNodes.length; j++) {
              if(nodes[i].innerHTML == myTxtNodes[j].innerHTML){
                $(nodes[i]).css({'border-style' : 'solid'});
                $(nodes[i]).css({'border-color' : 'red'});
              }
            }
          }

          console.log("Data length", w_data.length)

      })
}

reFormHtmlFile()
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

