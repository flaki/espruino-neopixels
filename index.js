var DIMMING = 1/5;

SPI2.setup({baud: 4*800000, mosi:B15});
var leds = new Uint8ClampedArray(8*8*3);

function pattern() {
  for (var i=0;i<leds.length;i+=3) {
    //leds[i+0] = leds[i+1] = leds[i+2] = 255/(1+i-i%3);
    leds[i+0] = leds[i+1] = leds[i+2] = 0;
    leds[i+Math.floor(Math.random()*3)] = 255/(1+i-i%3);
    leds[i+Math.floor(Math.random()*3)] = 255/(1+i-i%3);
  }
}

var pos;
function pattern2() {
  pos++;
  for (var i=0;i<leds.length;i+=3) {
    leds[i  ] = (1 + Math.sin((i+pos)*0.1324)) * 127;
    leds[i+1] = (1 + Math.sin((i+pos)*0.1654)) * 127;
    leds[i+2] = (1 + Math.sin((i+pos)*0.1)) * 127;
  }
}

var animPattern = pattern;

function pushPixels() {
    SPI2.send4bit(leds, 0b0001, 0b0011);
}

var anim;
function animate () {
  anim = setInterval(function () {
    pattern();
    pushPixels();
  }, 500);
}
function stopAnimation() {
  clearInterval(anim);
  anim = null;
}

function putPixel(x,y, r,g,b) {
  if (typeof r === "string") {
    var color=r,c;
    if (r[0] !== '#') {
      c = htmlcolor(r);
    } else {
      c = r;
    }
    r = 0;

    b = parseInt(c[5],16)*10 + parseInt(c[6],16);
    g = parseInt(c[3],16)*10 + parseInt(c[4],16);
    r = parseInt(c[1],16)*10 + parseInt(c[2],16);
    console.log(color,"is rgb(",r,g,b,")");
  }

  var i = c2i(x,y);
  leds[i]   = g*DIMMING;
  leds[i+1] = r*DIMMING;
  leds[i+2] = b*DIMMING;
}
function setPixel(x,y, r,g,b) {
  putPixel(x,y, r,g,b);
  pushPixels();
}

function setPixels(x1,y1, x2,y2, r,g,b) {
  for (var x=x1;x<=x2;x++) {
    for (var y=y1;y<=y2;y++) {
      putPixel(x,y, r,g,b);
    }
  }
  pushPixels();
}


function clearPixels() {
  for (var i=0;i<leds.length;leds[i++]=0) ;
}

function clear() {
  if (anim) stopAnimation();
  clearPixels();
  pushPixels();
}



function c2i(x,y) {
  return ( (y-1)*8 + x-1) * 3;
}

function htmlcolor(html) {
  switch (html) {
    case "white": return "#FFFFFF";
    case "silver": return "#C0C0C0";
    case "gray": return "#808080";
    case "black": return "#000000";
    case "red": return "#FF0000";
    case "maroon": return "#800000";
    case "yellow": return "#FFFF00";
    case "olive": return "#808000";
    case "lime": return "#00FF00";
    case "green": return "#008000";
    case "aqua": return "#00FFFF";
    case "teal": return "#008080";
    case "blue": return "#0000FF";
    case "navy": return "#000080";
    case "fuchsia": return "#FF00FF";
    case "purple": return "#800080";
    case "orange": return "#FFA500";
  }
}

function gradOneLiner() {
  while (--z>0) setPixels(1,1,z,z,200-20*z,0,15*z); z=8;
}
