var IRTE = { rteClass: 'rte', rteDocCSS: 'docRTE.css', windowClass: 'rteWin', windowTitleClass: 'rteWinTitle', imagePath: 'images/', rteDocHTML: null, allowEditSource: true, winArray: [], winStack: [], rteArray: [], btnArray: [], GetRTE: function (id) { return this.rteArray[id];}, IsCompatible: function()
{ var test=document.createElement('iframe'); if (test.contentDocument)
if (test.contentDocument.designMode)
return true; if (test.contentWindow)
if (test.contentWindow.document)
if (test.contentWindow.document.designMode)
return true; return false;},
GetDoc: function (rte)
{ if (rte.iframeE.contentDocument)
{ rte.docE = rte.iframeE.contentDocument; rte.docE.designMode = "On";}
else
{ rte.docE = rte.iframeE.contentWindow.document; rte.docE.designMode = "On"; rte.docE = rte.iframeE.contentWindow.document;}
}, CreateRTEs: function (initArray)
{ if (!this.IsCompatible())
return; var i=initArray.length; while (i--)
if (!this.CreateRTE(initArray[i][0],initArray[i][1],initArray[i][2]))
alert("Could not create RTE for: "+initArray[i][0]);}, CreateRTE: function (id,rteWidth,rteHeight)
{ if (!this.IsCompatible())
return; if (!this.rteDocHTML)
this.rteDocHTML='<link media="all" type="text/css" href="'+this.rteDocCSS+'" rel="stylesheet">'; var elmt=document.getElementById(id); if (!elmt) return null; var rte = { textareaE: elmt, toolbarE: document.createElement('div'), viewSrcE: document.createElement('label'), iframeE: document.createElement('iframe'), divE: document.createElement('div'), winDivE: document.createElement('div'), docE: null, brE: document.createElement('br'), width: rteWidth, height: rteHeight, isVisible: true
}; this.rteArray[id]=rte; rte.winDivE.className=""; rte.winDivE.style.position="relative"; rte.toolbarE.style.width = rteWidth + "px"; this.CreateToolBar(id); var node = document.createElement('input'); node.id=node.name=rte.viewSrcE.htmlFor=id+"_rte_vis"; node.type="checkbox"; rte.viewSrcE.appendChild(node); rte.viewSrcE.appendChild(document.createTextNode("View Source")); rte.iframeE.style.height = rteHeight + "px"; rte.iframeE.style.width = rteWidth + "px"; rte.iframeE.name=rte.iframeE.id=id+"_rte"; node = document.createElement('html'); node.appendChild(document.createElement('head')); node.appendChild(document.createElement('body')); rte.divE.className=this.rteClass; rte.divE.appendChild(rte.toolbarE); rte.divE.appendChild(rte.iframeE); rte.divE.appendChild(rte.winDivE); rte.divE.style.width = rteWidth + "px"; elmt.parentNode.insertBefore(rte.divE,elmt); elmt.parentNode.insertBefore(rte.viewSrcE,elmt); elmt.parentNode.removeChild(elmt); this.GetDoc(rte); var txt = elmt.value; if (!txt||txt=="")
txt="&nbsp;"; this.SetRTEHTML(id,elmt.value,true); if (rte.docE.body)
rte.docE.body.contentEditable = true; var irte = this; this.AddEvent(rte.viewSrcE.firstChild,"click",function() { irte.ToggleRTEVis(id);},true); this.AddEvent(rte.viewSrcE.firstChild,"change",function() { irte.ToggleRTEVis(id);},true); return rte;}, ToggleRTEVis: function (id)
{ var rte = this.GetRTE(id); if (rte.viewSrcE.firstChild.checked&&rte.isVisible)
{ rte.textareaE.value = this.GetRTEHTML(id); rte.divE.parentNode.insertBefore(rte.textareaE,rte.divE); rte.divE.parentNode.insertBefore(rte.brE,rte.divE); rte.divE.parentNode.removeChild(rte.divE); rte.isVisible=false;}
else if (!rte.viewSrcE.firstChild.checked&&!rte.isVisible)
{ rte.brE.parentNode.removeChild(rte.brE); rte.textareaE.parentNode.insertBefore(rte.divE,rte.textareaE); rte.textareaE.parentNode.removeChild(rte.textareaE); rte.isVisible=true; if (this.allowEditSource)
this.SetRTEHTML(id,rte.textareaE.value);}
}, GetRTEHTML: function(id)
{ var rte=this.GetRTE(id); if (!rte.isVisible)
return rte.textareaE.value; return rte.docE.body.innerHTML;}, SetRTEHTML: function(id,htmlText,isFirstTime)
{ var rte=this.GetRTE(id); if (!rte.isVisible)
rte.textareaE.value=htmlText; else if (document.all||isFirstTime)
{ rte.docE.open(); rte.docE.write(this.rteDocHTML+htmlText); rte.docE.close();}
else
{ this.GetDoc(rte); this.SetRTEHTML(id,htmlText,true);}
}, SetRTEEvent: function (id,eventName,eventFunc) { this.AddEvent(this.GetRTE(id).iframeE,eventName,eventFunc,true);}, ProcCmd: function (id,cmd,params)
{ var rte = this.GetRTE(id); if ((cmd=="backcolor")&&!document.all)
cmd="hilitecolor"; rte.docE.execCommand(cmd,false,params);}, RemoveButton: function(buttonName)
{ if (!this.btnArray.length)
this.GetDefaultButtons(); for (var i=0;i<this.btnArray.length;i++)
if (this.btnArray[i][1]==buttonName)
{ for (var j=i;j<(this.btnArray.length-1);j++)
this.btnArray[j]=this.btnArray[j+1]; this.btnArray.length--; return;}
}, AddButton: function (buttonDesc,position)
{ if (!this.btnArray.length)
this.GetDefaultButtons(); var len=this.btnArray.length; if (position)
for (var i=0;i<len;i++)
{ if (this.btnArray[i][1]==position)
{ var idx=i; while (len-->i)
this.btnArray[len+1]=this.btnArray[len]; this.btnArray[idx]=buttonDesc; return;}
}
else
this.btnArray[this.btnArray.length]=buttonDesc;}, GetDefaultButtons: function ()
{ var irte=this; this.btnArray=[['sel', 'Format', [['Style',''], ['Paragraph','<p>'], ['Heading 1','<h1>'], ['Heading 2','<h2>'], ['Heading 3','<h3>'], ['Heading 4','<h4>'], ['Heading 5','<h5>'], ['Heading 6','<h6>'], ['Address','<address>'], ['Preformatted','<pre>']], 'formatblock'], ['sel', 'Font', [['Font',''], ['Arial','Arial, Helvetica, sans-serif'], ['Comic Sans MS','Comic Sans MS, Comic Sans, Arial, Helvetica, sans-serif'], ['Courier New','Courier New, Courier, mono'], ['Geneva','Geneva, Arial, Helvetica, sans-serif'], ['Georgia','Georgia, "Times New Roman", Times, serif'], ['Times New Roman','Times New Roman, Times, serif'], ['Verdana','Verdana, Arial, Helvetica, sans-serif'], ['Other','']], 'fontname','Enter Font Name',''], ['sel','Font Size', [['Size',''], ['XX-Small','1'], ['X-Small','2'], ['Small','3'], ['Medium','4'], ['Large','5'], ['X-Large','6'], ['XX-Large','7']], 'fontsize'], ['but','Bold',"bold.gif","bold"], ['but',"Italics","italic.gif","italic"], ['but',"Underline","underline.gif","underline"], ['but',"Strikethrough","strikethrough.gif","strikethrough"], ['but',"Align Left","left_align.gif","justifyleft"], ['but',"Align Center","center.gif","justifycenter"], ['but',"Align Right","right_align.gif","justifyright"], ['but',"Align Justified","justify.gif","justifyfull"], ['but',"Numbered List","numbered_list.gif","insertorderedlist"], ['but',"Bulleted List","list.gif","insertunorderedlist"], ['but',"Outdent","outdent.gif","outdent"], ['but',"Indent","indent.gif","indent"], ['but',"Superscript","superscript.gif","superscript"], ['but',"Subscript","subscript.gif","subscript"], ['but',"Cut","cut.gif","cut"], ['but',"Copy","copy.gif","copy"], ['but',"Paste","paste.gif","paste"], ['but',"Undo","undo.gif","undo"], ['but',"Redo","redo.gif","redo"], ['but',"Insert Horizontal Rule","hr.gif","inserthorizontalrule"], ['but',"Insert Image","image.gif","insertimage",'','Enter Image URL','http://'], ['but',"Insert Table","insert_table.gif",function (id) { irte.InsertTable(id);}], ['but',"Insert E-Mail Link","email.gif",function (id) { irte.MailTo(id);}], ['but',"Insert Hyperlink","hyperlink.gif",function (id) { irte.Link(id);}], ['but',"Font Color","fontcolor.gif",function (id) { irte.GetColor(id,"forecolor","text");}], ['but',"Highlight Color","bgcolor.gif",function (id) { irte.GetColor(id,"backcolor","highlight");}], ['but',"Remove Formatting","remove_formatting.gif","removeformat"]]; if (!document.all)
{ this.RemoveButton("Cut"); this.RemoveButton("Copy"); this.RemoveButton("Paste");}
}, CreateToolBar: function (id)
{ if (!this.btnArray.length)
this.GetDefaultButtons(); var rte = this.GetRTE(id); var irte=this; for (var i=0;i<this.btnArray.length;i++)
{ switch (this.btnArray[i][0])
{ case 'sel':
rte.toolbarE.appendChild(this.CreateSelectList(id,this.btnArray[i][2],this.btnArray[i][3], this.btnArray[i][4],this.btnArray[i][5])); break; case 'but':
var fn=this.btnArray[i][3]; if (typeof(this.btnArray[i][3])=="function")
eval('fn=function () { irte.btnArray['+i+'][3]("'+id+'"); };'); rte.toolbarE.appendChild(this.CreateButton(id,this.btnArray[i][2],this.btnArray[i][1],fn, this.btnArray[i][4],this.btnArray[i][5],this.btnArray[i][6])); break; default:
break;}
}
}, CreateSelectList: function (id,options,cmd,promptUser,def)
{ var node = document.createElement('select'); for (var i=0;i<options.length;i++)
{ node.appendChild(document.createElement('option')); node.lastChild.appendChild(document.createTextNode(options[i][0])); node.lastChild.value=options[i][1];}
var irte=this; this.AddEvent(node,'change', function ()
{ if (node.selectedIndex>0)
{ if (node.options[node.selectedIndex].value)
irte.ProcCmd(id,cmd,node.options[node.selectedIndex].value); else
{ var p = prompt(promptUser,def); if (p)
irte.ProcCmd(id,cmd,p);}
}
node.selectedIndex=0;},true); return node;}, CreateButton: function (id,imgSrc,alt,cmd,params,promptUser,def)
{ var img = document.createElement('img'); img.src=this.imagePath+imgSrc; img.title=img.alt=alt; var irte = this; var func = null; if (typeof(cmd)=="function")
func = cmd; else if (promptUser)
func = function () { var p=prompt(promptUser,def); if (p) irte.ProcCmd(id,cmd,p);}; else
func = function () { irte.ProcCmd(id,cmd,params);}; this.AddEvent(img,'click',func,true); return img;}, Link: function (id)
{ var p = prompt('Enter link URL or blank to unlink','http://'); this.ProcCmd(id,'unlink'); if (p)
this.ProcCmd(id,'createlink',p);}, MailTo: function (id)
{ var p = prompt('Enter e-mail address',''); this.ProcCmd(id,'unlink'); if (p)
this.ProcCmd(id,'createlink','mailto:'+p);}, WindowClose: function (winE)
{ var irte=this; return function ()
{ winE.parentNode.removeChild(winE); irte.winStack.length--; if (irte.winStack.length)
irte.winStack[irte.winStack.length-1].style.visibility="visible";};}, WindowDiv: function (id,title,contentsE,okFn)
{ var rte = this.GetRTE(id); if (!this.winArray[title])
{ var winE=this.winArray[title]=document.createElement('div'); winE.style.position="absolute"; winE.style.left="0px"; winE.style.top= -rte.height+"px"; winE.style.zIndex=10; winE.className=this.windowClass; winE.appendChild(document.createElement('div')); winE.lastChild.className=this.windowTitleClass; winE.firstChild.appendChild(document.createTextNode(title)); winE.appendChild(contentsE); var button=document.createElement('button'); button.appendChild(document.createTextNode("Cancel")); winE.appendChild(document.createElement('div')); winE.lastChild.className=this.windowTitleClass; if (okFn)
{ winE.lastChild.appendChild(document.createElement('button')); winE.lastChild.lastChild.appendChild(document.createTextNode('Ok')); this.AddEvent(winE.lastChild.lastChild,"click",okFn,true); this.AddEvent(winE.lastChild.lastChild,"click",this.WindowClose(winE),true);}
winE.lastChild.appendChild(button); var irte=this; this.AddEvent(button,"click",this.WindowClose(winE),true); this.winArray[title]=winE;}
this.winStack[this.winStack.length]=this.winArray[title]; var i=this.winStack.length-1; while (i--)
this.winStack[i].style.visibility="hidden"; return this.winArray[title];}, GetColor: function(id,cmd,colorName,buffer)
{ var rte = this.GetRTE(id); var title='Pick '+colorName+' color'; var contE=null; var nodes=[]; if (!this.winArray[title])
{ contE = document.createElement('div'); var irte = this; var fn=cmd; var colors = ["#000000","#000000","#003300","#006600","#009900","#00CC00","#00FF00","#330000","#333300","#336600","#339900","#33CC00","#33FF00","#660000","#663300","#666600","#669900","#66CC00","#66FF00","#333333","#000033","#003333","#006633","#009933","#00CC33","#00FF33","#330033","#333333","#336633","#339933","#33CC33","#33FF33","#660033","#663333","#666633","#669933","#66CC33","#66FF33","#666666","#000066","#003366","#006666","#009966","#00CC66","#00FF66","#330066","#333366","#336666","#339966","#33CC66","#33FF66","#660066","#663366","#666666","#669966","#66CC66","#66FF66","#999999","#000099","#003399","#006699","#009999","#00CC99","#00FF99","#330099","#333399","#336699","#339999","#33CC99","#33FF99","#660099","#663399","#666699","#669999","#66CC99","#66FF99","#CCCCCC","#0000CC","#0033CC","#0066CC","#0099CC","#00CCCC","#00FFCC","#3300CC","#3333CC","#3366CC","#3399CC","#33CCCC","#33FFCC","#6600CC","#6633CC","#6666CC","#6699CC","#66CCCC","#66FFCC","#FFFFFF","#0000FF","#0033FF","#0066FF","#0099FF","#00CCFF","#00FFFF","#3300FF","#3333FF","#3366FF","#3399FF","#33CCFF","#33FFFF","#6600FF","#6633FF","#6666FF","#6699FF","#66CCFF","#66FFFF","#FF0000","#990000","#993300","#996600","#999900","#99CC00","#99FF00","#CC0000","#CC3300","#CC6600","#CC9900","#CCCC00","#CCFF00","#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00","#00FF00","#990033","#993333","#996633","#999933","#99CC33","#99FF33","#CC0033","#CC3333","#CC6633","#CC9933","#CCCC33","#CCFF33","#FF0033","#FF3333","#FF6633","#FF9933","#FFCC33","#FFFF33","#0000FF","#990066","#993366","#996666","#999966","#99CC66","#99FF66","#CC0066","#CC3366","#CC6666","#CC9966","#CCCC66","#CCFF66","#FF0066","#FF3366","#FF6666","#FF9966","#FFCC66","#FFFF66","#FFFF00","#990099","#993399","#996699","#999999","#99CC99","#99FF99","#CC0099","#CC3399","#CC6699","#CC9999","#CCCC99","#CCFF99","#FF0099","#FF3399","#FF6699","#FF9999","#FFCC99","#FFFF99","#00FFFF","#9900CC","#9933CC","#9966CC","#9999CC","#99CCCC","#99FFCC","#CC00CC","#CC33CC","#CC66CC","#CC99CC","#CCCCCC","#CCFFCC","#FF00CC","#FF33CC","#FF66CC","#FF99CC","#FFCCCC","#FFFFCC","#FF00FF","#9900FF","#9933FF","#9966FF","#9999FF","#99CCFF","#99FFFF","#CC00FF","#CC33FF","#CC66FF","#CC99FF","#CCCCFF","#CCFFFF","#FF00FF","#FF33FF","#FF66FF","#FF99FF","#FFCCFF","#FFFFFF"]; var i=colors.length; for (var i=0;i<colors.length;i++)
{ if ((i>0)&&(i%19==0))
contE.appendChild(document.createElement('br')); if (typeof(fn)=="function")
eval("cmd=function () { fn('"+colors[i]+"'); };"); var node = this.CreateButton(id,"spacer.gif",colors[i],cmd,colors[i]); node.width = 10; node.height = 10; node.style.backgroundColor = colors[i]; contE.appendChild(node); nodes[i]=node;}
}
var winE=this.WindowDiv(id,title,contE); winE.style.top= -rte.height+"px"; rte.winDivE.appendChild(winE); var i = nodes.length; while (i--)
this.AddEvent(nodes[i],"click",this.WindowClose(this.winArray[title]),true); return winE;}, InsertTable: function (id)
{ var irte = this; var contE = document.createElement('div'); var rowsE=this.CreateFormElmt(contE,id+"_rte_rows","Rows","text",null,5).lastChild; contE.appendChild(document.createElement('br')); var colsE=this.CreateFormElmt(contE,id+"_rte_cols","Cols","text",null,5).lastChild; contE.appendChild(document.createElement('br')); var padding=this.CreateFormElmt(contE,id+"_rte_padding","Padding","text",null,5).lastChild; contE.appendChild(document.createElement('br')); var cellSpacing=this.CreateFormElmt(contE,id+"_rte_cell_spacing","Cell Spacing","text",null,5).lastChild; contE.appendChild(document.createElement('br')); var widthE=this.CreateFormElmt(contE,id+"_rte_width","Width","text",null,5).lastChild; var widthTypeE=this.CreateFormElmt(contE,id+"_rte_width_type",null,"",[["Pixels","px"],["Percent","%"]]).lastChild; contE.appendChild(document.createElement('br')); var align=this.CreateFormElmt(contE,id+"_rte_align","Alignment","",[["None",""],["Right","right"],["Left","left"],["Center","center"]]).lastChild; contE.appendChild(document.createElement('br')); var borderStyle=this.CreateFormElmt(contE,id+"_rte_border_style","Border Style","",[["No Boarder",""],["Hidden","hidden"],["Dotted","dotted"],["Dashed","dashed"],["Solid","solid"],["Double","double"],["Groove","groove"],["Ridge","ridge"],["Inset","inset"],["Outset","outset"]]).lastChild; contE.appendChild(document.createElement('br')); var borderWidth=this.CreateFormElmt(contE,id+"_rte_border_width","Border Width","",[["Thin","thin"],["Medium","medium"],["Thick","thick"],["1 px","1px"],["2 px","2px"],["3 px","3px"],["4 px","4px"],["5 px","5px"],["6 px","6px"]]).lastChild; contE.appendChild(document.createElement('br')); var bId = id+"_border_color"; var borderColor=this.CreateFormElmt(contE,bId,"Border Color","text",null,7).lastChild; contE.appendChild(document.createElement('button')); contE.lastChild.appendChild(document.createTextNode("Pick")); this.AddEvent(contE.lastChild,"click", function () { irte.GetColor(id, function (color) { borderColor.value=color;}, 'Border');}, true); contE.appendChild(document.createElement('br')); var cellBorderStyle=this.CreateFormElmt(contE,id+"_rte_cell_border_style","Cell Border Style","",[["No Boarder",""],["Hidden","hidden"],["Dotted","dotted"],["Dashed","dashed"],["Solid","solid"],["Double","double"],["Groove","groove"],["Ridge","ridge"],["Inset","inset"],["Outset","outset"]]).lastChild; contE.appendChild(document.createElement('br')); var cellBorderWidth=this.CreateFormElmt(contE,id+"_rte_cell_border_width","Cell Border Width","",[["Thin","thin"],["Medium","medium"],["Thick","thick"],["1 px","1px"],["2 px","2px"],["3 px","3px"],["4 px","4px"],["5 px","5px"],["6 px","6px"]]).lastChild; contE.appendChild(document.createElement('br')); var bId0 = id+"_cell_border_color"; var cellBorderColor=this.CreateFormElmt(contE,bId0,"Cell Border Color","text",null,7).lastChild; contE.appendChild(document.createElement('button')); contE.lastChild.appendChild(document.createTextNode("Pick")); this.AddEvent(contE.lastChild,"click", function () { irte.GetColor(id, function (color) { cellBorderColor.value=color;}, 'Cell Border');}, true); contE.appendChild(document.createElement('br')); var bId2 = id+"_background_color"; var bgColor=this.CreateFormElmt(contE,bId2,"Background Color","text",null,7).lastChild; contE.appendChild(document.createElement('button')); contE.lastChild.appendChild(document.createTextNode("Pick")); this.AddEvent(contE.lastChild,"click", function () { irte.GetColor(id, function (color)
{ bgColor.value=color;},'Background');},true); var rte = this.GetRTE(id); var irte=this; rte.winDivE.appendChild(this.WindowDiv(id,'Insert Table',null,contE, function ()
{ if (!rowsE.value||!colsE.value)
return; var tbl=document.createElement('table'); tbl.appendChild(document.createElement('tbody')); var rows=rowsE.value; while (rows--)
{ tbl.lastChild.appendChild(document.createElement('tr')); var cols=colsE.value; while (cols--)
{ tbl.lastChild.lastChild.appendChild(document.createElement('td')); tbl.lastChild.lastChild.lastChild.appendChild(document.createTextNode(' ')); if (cellBorderStyle.value)
{ tbl.lastChild.lastChild.lastChild.style.borderStyle=cellBorderStyle.value; tbl.lastChild.lastChild.lastChild.style.borderWidth=cellBorderWidth.value; if (cellBorderColor.value)
tbl.lastChild.lastChild.lastChild.style.borderColor=cellBorderColor.value;}
if (padding.value)
tbl.lastChild.lastChild.lastChild.style.padding=padding.value+"px";}
}
if (cellSpacing.value)
tbl.cellSpacing=cellSpacing.value; if (widthE.value)
tbl.style.width=String(widthE.value+widthTypeE.value); if (align.value)
tbl.style.alignment=align.value; if (borderStyle.value)
{ tbl.style.borderStyle=borderStyle.value; tbl.style.borderWidth=borderWidth.value; if (borderColor.value)
tbl.style.borderColor=borderColor.value;}
if (bgColor.value)
tbl.style.backgroundColor=bgColor.value; irte.InsertNode(id,tbl);}));}, CreateFormElmt: function (node,elmtID,lbl,type,options,size)
{ if (lbl)
{ node.appendChild(document.createElement('label')); node.lastChild.appendChild(document.createTextNode(lbl)); node.lastChild.htmlFor = elmtID;}
if (!options)
{ node.appendChild(document.createElement('input')); node.lastChild.type=type; if (size)
node.lastChild.size=size;}
else
{ node.appendChild(document.createElement('select')); for (var i=0;i<options.length;i++)
{ node.lastChild.appendChild(document.createElement('option')); node.lastChild.lastChild.appendChild(document.createTextNode(options[i][0])); node.lastChild.lastChild.value=options[i][1];}
}
node.lastChild.id=node.lastChild.name=elmtID; return node;}, InsertNode: function (id,node)
{ var rte = this.GetRTE(id); if (rte.docE.getSelection)
this.ProcCmd(id,'inserthtml',node.outerHTML); else if (rte.docE.selection)
{ var rng = rte.docE.selection.createRange(); if (rng.text!="")
rng.pasteHTML(node.outerHTML); else
this.SetRTEHTML(id,this.GetRTEHTML(id)+node.outerHTML);}
}, AddEvent: function (elm,evType,fn,useCapture)
{ if (elm.addEventListener)
elm.addEventListener(evType,fn,useCapture); else if (elm.attachEvent)
return elm.attachEvent('on'+evType,fn); else
elm['on'+evType] = fn; return true;}, SubmitPrep: function()
{ for (var i in this.rteArray)
{ this.rteArray[i].viewSrcE.firstChild.checked=true; this.ToggleRTEVis(i);}
}
};