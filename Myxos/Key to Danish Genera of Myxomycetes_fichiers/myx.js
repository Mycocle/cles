/*
  www.myx.dk utility functions
  H. F. Gøtzsche 2008-2012
*/

var refUrl = "http://" + window.location.hostname + "/cgi-bin/myxpapers";
var refUrl2 = "http://" + window.location.hostname + "/cgi-bin/myxchklst";

var abstWinDef = "onClick=\"var w1=window.open('','win1','height=800,width=850,scrollbars=yes,resizable=no'); w1.focus()\" target=\"win1\"";
var imgWinDef = "onClick=\"var w2=window.open('','win2','height=800,width=1000,scrollbars=yes,resizable=no'); w2.focus()\" target=\"win2\"";
var req;
var strNoDetails = "Hide details";
var strDetails = "Show details";
var strNoAbstract = "No abstract available";

var strEprint = "Digital facsimile";
var strFulltext = "Full text";

/*---------------------------------------------------------------------------*/

var req1;
var req2;

function initXml(n) {
  var req;
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest;
  }
  else if (window.ActiveXObject) {
    try {
      req = new ActiveXObject("Msxml2.XMLHTTP"); 
    }
    catch (e) {
      req = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
  }
  if (n == 1) { req1 = req; }
  else if (n == 2) { req2 = req; }
}

/*---------------------------------------------------------------------------*/
/* references */

function getReferenceDetails(id) {
  initXml(1);
  var url = refUrl + "?acti=xdet&id=" + id;
  req1.open("GET", url, true);
  req1.onreadystatechange=setReferenceDetails;
  req1.send(null);
}

function setReferenceDetails() {
  if (req1.readyState == 4) {
    if (req1.status == 200) {
      var text = "<p/>";

      try { var id = req1.responseXML.getElementsByTagName("id")[0].firstChild.nodeValue; }
      catch (e) { var id = "0"; }

      try { var abstr = req1.responseXML.getElementsByTagName("abstract")[0].firstChild.nodeValue; }
      catch (e) { var abstr = ""; }

      try { var comment = req1.responseXML.getElementsByTagName("comment")[0].firstChild.nodeValue; }
      catch (e) { var comment = ""; }

      try { var fulltext = req1.responseXML.getElementsByTagName("fulltext")[0].firstChild.nodeValue; }
      catch (e) { var fulltext = "0"; }

      try { var image = req1.responseXML.getElementsByTagName("image")[0].firstChild.nodeValue; }
      catch (e) { var image = "0"; }

      try { var online = req1.responseXML.getElementsByTagName("online")[0].firstChild.nodeValue; }
      catch (e) { var online = "0"; }

      try { var onlineurl = req1.responseXML.getElementsByTagName("onlineurl")[0].firstChild.nodeValue; }
      catch (e) { var onlineurl = ""; }

      try { var thiscitation = req1.responseXML.getElementsByTagName("thiscitation")[0].firstChild.nodeValue; }
      catch (e) { var thiscitation = "0"; }

      try { var othercitation = req1.responseXML.getElementsByTagName("othercitation")[0].firstChild.nodeValue; }
      catch (e) { var othercitation = "0"; }

      try { var taxa = req1.responseXML.getElementsByTagName("taxa")[0].firstChild.nodeValue; }
      catch (e) { var taxa = "0"; }

      var field = document.getElementById("d" + id);
      
      if (comment != "") { text = text + comment + "<p/>"; }

      if (online == '1') { 
        text = text + "<a href=\"" + onlineurl + "\"" + abstWinDef + ">Available online</a><p/>"; 
      }
      if (thiscitation == '1') { 
        text = text + "<a href=\"" + refUrl + "?acti=citt&tiid=" + id + " target=\"_blank\">Citations in this paper</a><p/>";
      }
      if (othercitation == '1') { 
        text = text + "<a href=\"" + refUrl + "?acti=cito&tiid=" + id + " target=\"_blank\">Other papers citing this one</a><p/>";
      }
      if (taxa == '1') { 
        text = text + "<a href=\"" + refUrl + "?acti=taxa&tiid=" + id + " \"" + abstWinDef + ">Taxa mentioned in this paper</a><p/>"; 
      }
      if (fulltext == '1') { 
        text = text + "<a href=\"" + refUrl + "?acti=ftxl&tiid=" + id + "&lpag=0001\"" + abstWinDef + ">" + strFulltext + "</a><p/>"; 
      }
      if (image == '1') { 
        text = text + "<a href=\"" + refUrl + "?acti=imgl&tiid=" + id + "&lpag=0001\"" + imgWinDef + ">" + strEprint + "</a><p/>"; 
      }
      if (abstr == "") { text = text + strNoAbstract; }
      else { text = text + "Abstract <br/>" + abstr; }

      text = "<br/><hr size=\"1\" width=\"96%\">" + text + 
             "<hr size=\"1\" width=\"96%\"><br/>" + 
             "<div class=\"details\">" +
             "<a href=\"javascript:closeReferenceDetails(" + id + ")\">" + 
             strNoDetails + " <img src=\"/inc/up.gif\" border=\"0\"></a></div>";
      field.innerHTML = text;
    }
  }
}

function closeReferenceDetails(id) {
  var field = document.getElementById("d" + id);
  var text = "";
  text = text + "<div class=\"details\">" + 
         "<a href=\"javascript:getReferenceDetails(" + id + ")\">" + 
         strDetails + " <img src=\"/inc/down.gif\" border=\"0\"></a></div>";
  field.innerHTML = text;
}

/*---------------------------------------------------------------------------*/
/* cheklists */

function getChklstRefsDetails(country) {
  initXml(2);
  var url = refUrl2 + "?acti=xdet&coun=" + country;
  req2.open("GET", url, true);
  req2.onreadystatechange=setChklstRefsDetails;
  req2.send(null);
}

function setChklstRefsDetails() {
  if (req2.readyState == 4) {
    if (req2.status == 200) {
      var text = "Literature consulted: " + "<br/>";

      var referenceSet = req2.responseXML.getElementsByTagName("reference");

      for (var i = 0; i < referenceSet.length; i++) {
        try { var country = req2.responseXML.getElementsByTagName("country")[i].firstChild.nodeValue; }
        catch (e) { var country = ""; }
        try { var urn = req2.responseXML.getElementsByTagName("urn")[i].firstChild.nodeValue; }
        catch (e) { var urn = ""; }
        try { var authors = req2.responseXML.getElementsByTagName("authors")[i].firstChild.nodeValue; }
        catch (e) { var authors = ""; }
        try { var year = req2.responseXML.getElementsByTagName("year")[i].firstChild.nodeValue; }
        catch (e) { var year = ""; }
        try { var publication = req2.responseXML.getElementsByTagName("publication")[i].firstChild.nodeValue; }
        catch (e) { var publication = ""; }
        try { var volume = req2.responseXML.getElementsByTagName("volume")[i].firstChild.nodeValue; }
        catch (e) { var volume = ""; }
        try { var pages = req2.responseXML.getElementsByTagName("pages")[i].firstChild.nodeValue; }
        catch (e) { var pages = ""; }
        text = text + "<a href=/purl/p/" + urn + ">" + 
               authors + " " + year + " - " + publication; 
        if ( volume != '' ) { text = text  + " " + volume; }
        text = text + ", " + pages;
        text = text + "</a>" + "<br/>"
      }

      var field = document.getElementById(country);

      text = text + "<br/><div class=\"details\">" + 
                           "<a href=\"javascript:closeChklstRefsDetails('" + country + "')\">" + 
                           strNoDetails + " <img src=\"/inc/up.gif\" border=\"0\"></a>" + 
                           "</div></div>";
      field.innerHTML = text;
    }
  }
}

function closeChklstRefsDetails(country) {
  var field = document.getElementById(country);
  var text = "";
  text = text + "<div class=\"details\">" + 
         "<a href=\"javascript:getChklstRefsDetails('" + country + "')\">" + 
         strDetails + " <img src=\"/inc/down.gif\" border=\"0\"></a></div>";
  field.innerHTML = text;
}

/*---------------------------------------------------------------------------*/
/* cheklists - genera and species */

function getChklstGenera() {
  initXml(2);
  var url = refUrl2 + "?acti=xgen";
  req2.open("GET", url, true);
  req2.onreadystatechange=setChklstGenera;
  req2.send(null);
}

function setChklstGenera() {
  if (req2.readyState == 4) {
    if (req2.status == 200) {

      var taxStart = 1;
      var genStart = "";

      var text = "";

      var generaSet = req2.responseXML.getElementsByTagName("genera");

      for (var i = 0; i < generaSet.length; i++) {
        try { var genus = req2.responseXML.getElementsByTagName("genus")[i].firstChild.nodeValue; }
        catch (e) { var genus = ""; }

        if ( genStart == "" ) { genStart = genus; }

        text = text + "<option value=\"" + genus + "\">" + genus + "</option>\n";
      }

      var field = document.getElementById("genusdiv");

      text = "<select name=\"genus\" onchange=\"javascript:getChklstSpp(this.value)\">" + text;
      text = text + "</select> &nbsp;";

      field.innerHTML = text;

      if ( taxStart ) {
        getChklstSpp(genStart)
        taxStart = 0;
      }
    }
  }
}


function getChklstSpp(genus) {
  initXml(1);
  var url = refUrl2 + "?acti=xspp&gen=" + genus;
  req1.open("GET", url, true);
  req1.onreadystatechange=setChklstSpp;
  req1.send(null);
}

function setChklstSpp() {
  if (req1.readyState == 4) {
    if (req1.status == 200) {
      var text = "";

      var sppSet = req1.responseXML.getElementsByTagName("spp");

      for (var i = 0; i < sppSet.length; i++) {
        try { var species = req1.responseXML.getElementsByTagName("species")[i].firstChild.nodeValue; }
        catch (e) { var species = ""; }

        if ( species != "sp." ) {
          text = text + "<option value=\"" + species + "\">" + species + "</option>\n";
        }
      }

      var field = document.getElementById("speciesdiv");

      text = "<select name=\"species\">" + text;
      text = text + "</select> &nbsp;";

      field.innerHTML = text;
    }
  }
}

/*---------------------------------------------------------------------------*/

function sHImg(imgUrl,imgTxt,h,w) {

  var regStr = imgUrl;
  var regPat = /img\_[0-9]{4}\_\d/i;
  var winName = regStr.match(regPat);

  var width = w + 15;
  var height = h + 180;

  var win1 = window.open('/inc/win.html?hintImg='+imgUrl+'&hintTxt='+imgTxt ,winName,   +
                        'menubar=0,location=0,resizable=0,scrollbars=0,toolbar=0,' +
                        'directories=0,status=0,width='+ width +',height=' + height);
}

/*---------------------------------------------------------------------------*/

function doSubmit (field, e) {

  var keycode;

  if (window.event) keycode = window.event.keyCode;
  else if (e) keycode = e.which;
  else return true;

  if (keycode == 13) {
    field.form.submit();
    return false;
  }
  else
    return true;
}
/*---------------------------------------------------------------------------*/

