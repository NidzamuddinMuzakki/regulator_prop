(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{1570:function(e,t){},1767:function(e,t,a){"use strict";a.r(t),a.d(t,"default",function(){return M});var l=a(111),n=a(519),s=a(597),i=a(602),o=a(601),d=a(0),c=a.n(d),r=a(1717),m=(a(1563),a(1180)),u=a(1800),b=a(1310),f=a(1210),p=a(1720),h=a(1587),g=a(1104),E=a(1235),S=a(1105),_=a(1211),D=a(1588),T=a(1311),v=a(1589),I=a(1312),N=a(1590),C=a(1564),O=a.n(C),y=a(1568),k=a.n(y),F=a(1570),j=a.n(F),w=a(497),M=function(e){Object(i.a)(a,e);var t=Object(o.a)(a);function a(e){var s;return Object(n.a)(this,a),(s=t.call(this,e)).optionTableGet=function(){w.a.post("/api/dtr/options/table/get").then(function(e){s.setState({table_Items:e.data.table_Items,tableCat_Items:e.data.tableCat_Items},function(){})})},s.optionSourceFieldGet=function(e,t){e.length>0?w.a.post("/api/dtr/options/sourcefield/get",null,{params:{tables:e}}).then(function(e){s.setState(Object(l.a)({},"sourceField_Items"+t,e.data.sourceField_Items),function(){})}):s.setState(Object(l.a)({},"sourceField_Items"+t,[]))},s.optionFilterFieldGet=function(e,t){e.length>0?w.a.post("/api/dtr/options/filterfield/get",null,{params:{tables:e}}).then(function(e){s.setState(Object(l.a)({},"filterField_Items"+t,e.data),function(){})}):s.setState(Object(l.a)({},"filterField_Items"+t,{fields:{}}))},s.optionKeyFieldGet=function(e,t){e.length>0?w.a.post("/api/dtr/options/keyfield/get",null,{params:{tables:e}}).then(function(e){for(var a=0;a<s.state.sourceTree_Data.length;a++)if(s.state.sourceTree_Data[a].id==t&&void 0!=s.state.sourceTree_Data[a].children)for(var n=0;n<s.state.sourceTree_Data[a].children.length;n++)console.log("CHECK STATE VALUE 4 KEY ITEMS  "),console.log(s.state.sourceTree_Data[a].children[n].id),s.setState(Object(l.a)({},"keyField_Items"+s.state.sourceTree_Data[a].children[n].id,e.data),function(){})}):s.setState(Object(l.a)({},"keyField_Items"+t,{}))},s.handleMultiSelectChange=function(e){s.setState({selTableItems:e})},s.handleChange=function(e){s.setState(Object(l.a)({},e.target.name,e.target.value),function(){})},s.handleSelectTableCatChange=function(e){s.setState({selTableCat:e.target.value},function(){w.a.post("/api/dtr/options/table/get",null,{params:{tablecat:s.state.selTableCat}}).then(function(e){s.setState({table_Items:e.data.table_Items,tableCat_Items:e.data.tableCat_Items},function(){})})})},s.updateParentState=function(e,t){s.setState(Object(l.a)({},e,t),function(){console.log(e),console.log(s.state[e])}),console.log(e),console.log(t)},s.modifyButton=function(e){},s.changeChecking=function(e){for(var t=!0,a=0;a<e.length;a++)if("table"==e[a].type&&(t=!1),void 0!=e[a].children)for(var l=0;l<e[a].children.length;l++)"source"==e[a].children[l].type&&(t=!1);t&&s.setState({sourceTree_Data:e})},s.removeNode=function(e){for(var t=Object.assign([],s.state.sourceTree_Data),a=0;a<t.length;a++){if(void 0!=t[a].children)for(var n=0;n<t[a].children.length;n++)if(t[a].children[n].id==e){var i;s.optionFilterFieldGet(t[a].children,t[a].id),s.optionSourceFieldGet(t[a].children,t[a].id),s.optionKeyFieldGet(t[a].children,t[a].id);var o=Object.assign([],s.state["field_Data"+t[a].id]),d=Object.assign([],s.state["sort_Data"+t[a].id]);console.log("check temp sort data:"),console.log(d);for(var c=0;c<o.length;c++)o[c].group==t[a].children[n].title&&(o.splice(c,1),c-=1);for(var r=0;r<d.length;r++)d[r].group==t[a].children[n].title&&(d.splice(r,1),r-=1);s.setState((i={},Object(l.a)(i,"field_Data"+t[a].id,o),Object(l.a)(i,"sort_Data"+t[a].id,d),i)),t[a].children.splice(n,1)}t[a].id==e&&t.splice(a,1)}s.setState({sourceTree_Data:t},function(){})},s.updateNode=function(e,t){for(var a=Object.assign([],s.state.sourceTree_Data),l=0;l<a.length;l++)a[l].id==e&&(a[l].title=t);s.setState({sourceTree_Data:a},function(){})},s.tableAdd=function(){s.setState({table_Modal:!s.state.table_Modal},function(){s.setState({selTableItems:[]})})},s.tableAddFromSource=function(e){s.setState({table_Modal:!s.state.table_Modal,selId:e},function(){s.setState({selTableItems:[]})})},s.tableAddCancel=function(){s.setState({table_Modal:!s.state.table_Modal},function(){})},s.tableAddSave=function(){for(var e,t=Object.assign([],s.state.sourceTree_Data),a=0,l="",n="",i=!1,o=1,d=0;d<s.state.sourceTree_Data.length;d++)s.state.sourceTree_Data[d].id==s.state.selId&&(a=d);for(var c=0;c<s.state.selTableItems.length;c++){n="",o=1;for(var r=0;r<t.length;r++)if(t[r].id==s.state.selId&&void 0!=t[r].children)for(var m=0;m<t[r].children.length;m++)t[r].children[m].title==s.state.selTableItems[c].label&&(i=!0,s.state.selTableItems[c].label==t[r].children[m].title.substr(0,s.state.selTableItems[c].label.length)&&"_"==t[r].children[m].title.substr(s.state.selTableItems[c].label.length,1)&&(l=t[r].children[m].title.substr(s.state.selTableItems[c].label.length+1),parseInt(l)>o&&(o=parseInt(l))),o++,n=s.state.selTableItems[c].label+"_"+o);i?i=!1:n=s.state.selTableItems[c].label,e={title:n,table:s.state.selTableItems[c].label,id:s.id++,code:s.state.selTableItems[c].id,type:"table",className:"fa fa-table",iskeys:!1,keys:{}},void 0!=t[a].children&&null!=t[a].children||(t[a].children=[]),t[a].expanded=!0,t[a].children.push(e)}s.setState({sourceTree_Data:t,table_Modal:!s.state.table_Modal},function(){for(var e=0,l=0;l<s.state.sourceTree_Data.length;l++)if(s.state.sourceTree_Data[l].id==s.state.selId)e=s.state.sourceTree_Data[l].id;else for(var n=0;n<s.state.sourceTree_Data[l].children.length;n++)s.state.sourceTree_Data[l].children[n].id==s.state.selId&&(s.state.sourceTree_Data[l].children[n].id,e=s.state.sourceTree_Data[l].id);s.optionFilterFieldGet(t[a].children,e),s.optionSourceFieldGet(t[a].children,e),s.optionKeyFieldGet(t[a].children,e)})},s.sourceAdd=function(){s.setState({source_Modal:!s.state.source_Modal},function(){})},s.sourceAddCancel=function(){s.setState({source_Modal:!s.state.source_Modal},function(){s.setState({sourcename_Input:""})})},s.sourceAddSave=function(){var e=Object.assign([],s.state.sourceTree_Data),t={title:s.state.sourcename_Input,id:s.id++,type:"source",className:"fa fa-th-large",isfilter:!1,filter:{},isfields:!1,fields:{},issortfields:!1,sortfields:{}};e.push(t),s.setState({sourceTree_Data:e,source_Modal:!s.state.source_Modal},function(){s.setState({sourcename_Input:""})})},s.previewSources=function(){console.log("PREVIEW SOURCES");for(var e="",t=0;t<s.state.sourceTree_Data.length;t++){var a="";if(void 0!=s.state["field_Data"+s.state.sourceTree_Data[t].id])for(var l=0;l<s.state["field_Data"+s.state.sourceTree_Data[t].id].length;l++)l>0&&(a+=", "),a+=s.state["field_Data"+s.state.sourceTree_Data[t].id][l].field+" '"+s.state["field_Data"+s.state.sourceTree_Data[t].id][l].label+"'";var n="";if(void 0!=s.state.sourceTree_Data[t].children)for(var i=0;i<s.state.sourceTree_Data[t].children.length;i++)i>0&&(n+=" left join "),n+=s.state.sourceTree_Data[t].children[i].table+" "+s.state.sourceTree_Data[t].children[i].title,i>0&&(n+=" on ",void 0!=s.state["keySql_Data"+s.state.sourceTree_Data[t].children[i].id]&&(n+=s.state["keySql_Data"+s.state.sourceTree_Data[t].children[i].id]));var o="";void 0!=s.state["filterSql_Data"+s.state.sourceTree_Data[t].id]&&(o=s.state["filterSql_Data"+s.state.sourceTree_Data[t].id]);var d="";if(void 0!=s.state["sort_Data"+s.state.sourceTree_Data[t].id])for(var c=0;c<s.state["sort_Data"+s.state.sourceTree_Data[t].id].length;c++)c>0&&(d+=", "),d+=s.state["sort_Data"+s.state.sourceTree_Data[t].id][c].field;var r="";""!=a&&(r+="SELECT "+a),""!=n&&(r+=" FROM "+n),""!=o&&(r+=" WHERE "+o),""!=d&&(r+=" ORDER BY "+d),""!=r&&(t>0&&(e+=" UNION ALL "),e+=r)}console.log(e),s.setState({previewSql_Data:e,preview_Modal:!0})},s.previewClose=function(){s.setState({preview_Modal:!s.state.preview_Modal})},s.id=3,s.state={selId:null,selPanel:null,source_Modal:!1,table_Modal:!1,preview_Modal:!1,sourcename_Input:"",table_Items:[{id:"0110001",label:"Customer_CoreBank"},{id:"0110002",label:"Customer_CreditCard",disabled:!1},{id:"0110003",label:"Deposits",disabled:!1},{id:"0110004",label:"Savings"},{id:"0110005",label:"CurrentAccounts"},{id:"0110006",label:"Loans"}],tableCat_Items:[],selTableItems:[],sourceTree_Data:[{title:"Source 1",id:1,type:"source",className:"fa fa-th-large",isfilter:!1,filter:{},isfields:!1,fields:{},issortfields:!1,sortfields:{}}],getNodeKey:function(e){return e.treeIndex},generateNodeProps:function(e){return{listIndex:0,lowerSiblingCounts:[],title:c.a.createElement("span",null,c.a.createElement("i",{className:e.node.className,"aria-hidden":"true"}),"\xa0",e.node.title),style:{color:e.node.id==s.state.selId?"#63c2de":""},buttons:null!=e.parentNode?e.path[1]-e.path[0]!=1?[e.node.iskeys?c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnKey"+e.node.id,color:"info",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"99"},function(){s.setState({selId:e.node.id,selPanel:"13"})})}},c.a.createElement("i",{className:"fa fa-key"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnKey"+e.node.id],target:"btnKey"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnKey"+e.node.id,!s.state["btnKey"+e.node.id]))}},"Join Key")):c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnKey"+e.node.id,color:"warning",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"99"},function(){s.setState({selId:e.node.id,selPanel:"13"})})}},c.a.createElement("i",{className:"fa fa-key"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnKey"+e.node.id],target:"btnKey"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnKey"+e.node.id,!s.state["btnKey"+e.node.id]))}},"Join Key")),c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnDeleteTable"+e.node.id,outline:!0,color:"danger",size:"sm",className:"btn-pill",onClick:function(){s.removeNode(e.node.id),0!=e.parentNode.children.length&&e.node.id!=s.state.selId||s.setState({selId:e.node.id,selPanel:"99"},function(){})}},c.a.createElement("i",{className:"fa fa-trash"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnDeleteTable"+e.node.id],target:"btnDeleteTable"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnDeleteTable"+e.node.id,!s.state["btnDeleteTable"+e.node.id]))}},"Delete Table"))]:[c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnDeleteTable"+e.node.id,outline:!0,color:"danger",size:"sm",className:"btn-pill",onClick:function(){s.removeNode(e.node.id),(0==e.parentNode.children.length||e.node.id==s.state.selId||1==e.parentNode.children.length&&"13"==s.state.selPanel)&&s.setState({selId:e.node.id,selPanel:"99"},function(){})}},c.a.createElement("i",{className:"fa fa-trash"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnDeleteTable"+e.node.id],target:"btnDeleteTable"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnDeleteTable"+e.node.id,!s.state["btnDeleteTable"+e.node.id]))}},"Delete Table"))]:void 0==e.node.children?[c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnEditSource"+e.node.id,outline:!0,color:"secondary",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"00"})}},c.a.createElement("i",{className:"fa fa-pencil"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnEditSource"+e.node.id],target:"btnEditSource"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnEditSource"+e.node.id,!s.state["btnEditSource"+e.node.id]))}},"Edit Source Name")),c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnTable"+e.node.id,color:"warning",size:"sm",className:"btn-pill",onClick:function(){s.tableAddFromSource(e.node.id)}},c.a.createElement("i",{className:"fa fa-table"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnTable"+e.node.id],target:"btnTable"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnTable"+e.node.id,!s.state["btnTable"+e.node.id]))}},"Add New Table")),c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnDeleteSource"+e.node.id,outline:!0,color:"danger",size:"sm",className:"btn-pill",onClick:function(){s.removeNode(e.node.id)}},c.a.createElement("i",{className:"fa fa-trash"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnDeleteSource"+e.node.id],target:"btnDeleteSource"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnDeleteSource"+e.node.id,!s.state["btnDeleteSource"+e.node.id]))}},"Delete Source"))]:e.node.children.length>0?[c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnFilter"+e.node.id,outline:!0,color:"primary",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"99"},function(){s.setState({selId:e.node.id,selPanel:"01"})})}},c.a.createElement("i",{className:"fa fa-filter"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnFilter"+e.node.id],target:"btnFilter"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnFilter"+e.node.id,!s.state["btnFilter"+e.node.id]))}},"Source Filter"),c.a.createElement(m.a,{id:"btnEditSource"+e.node.id,outline:!0,color:"secondary",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"00"})}},c.a.createElement("i",{className:"fa fa-pencil"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnEditSource"+e.node.id],target:"btnEditSource"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnEditSource"+e.node.id,!s.state["btnEditSource"+e.node.id]))}},"Edit Source Name")),c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnTable"+e.node.id,outline:!0,color:"secondary",size:"sm",className:"btn-pill",onClick:function(){s.tableAddFromSource(e.node.id)}},c.a.createElement("i",{className:"fa fa-table"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnTable"+e.node.id],target:"btnTable"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnTable"+e.node.id,!s.state["btnTable"+e.node.id]))}},"Add New Table")),e.node.isfields?c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnField"+e.node.id,color:"info",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"99"},function(){s.setState({selId:e.node.id,selPanel:"03"})})}},c.a.createElement("i",{className:"fa fa-tasks"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnField"+e.node.id],target:"btnField"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnField"+e.node.id,!s.state["btnField"+e.node.id]))}},"Field Selection & Transformation")):c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnField"+e.node.id,color:"warning",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"99"},function(){s.setState({selId:e.node.id,selPanel:"03"})})}},c.a.createElement("i",{className:"fa fa-tasks"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnField"+e.node.id],target:"btnField"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnField"+e.node.id,!s.state["btnField"+e.node.id]))}},"Field Selection & Transformation")),e.node.issortfields?c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnSort"+e.node.id,color:"info",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"04"})}},c.a.createElement("i",{className:"fa fa-sort-amount-asc"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnSort"+e.node.id],target:"btnSort"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnSort"+e.node.id,!s.state["btnSort"+e.node.id]))}},"Sort Order")):c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnSort"+e.node.id,outline:!0,color:"primary",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"04"})}},c.a.createElement("i",{className:"fa fa-sort-amount-asc"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnSort"+e.node.id],target:"btnSort"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnSort"+e.node.id,!s.state["btnSort"+e.node.id]))}},"Sort Order")),c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnDeleteSource"+e.node.id,outline:!0,color:"danger",size:"sm",className:"btn-pill",onClick:function(){s.removeNode(e.node.id)}},c.a.createElement("i",{className:"fa fa-trash"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnDeleteSource"+e.node.id],target:"btnDeleteSource"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnDeleteSource"+e.node.id,!s.state["btnDeleteSource"+e.node.id]))}},"Delete Source"))]:[c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnEditSource"+e.node.id,outline:!0,color:"secondary",size:"sm",className:"btn-pill",onClick:function(){s.setState({selId:e.node.id,selPanel:"00"})}},c.a.createElement("i",{className:"fa fa-pencil"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnEditSource"+e.node.id],target:"btnEditSource"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnEditSource"+e.node.id,!s.state["btnEditSource"+e.node.id]))}},"Edit Source Name")),c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnTable"+e.node.id,color:"warning",size:"sm",className:"btn-pill",onClick:function(){s.tableAddFromSource(e.node.id)}},c.a.createElement("i",{className:"fa fa-table"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnTable"+e.node.id],target:"btnTable"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnTable"+e.node.id,!s.state["btnTable"+e.node.id]))}},"Add New Table")),c.a.createElement("div",null,c.a.createElement(m.a,{id:"btnDeleteSource"+e.node.id,outline:!0,color:"danger",size:"sm",className:"btn-pill",onClick:function(){s.removeNode(e.node.id)}},c.a.createElement("i",{className:"fa fa-trash"})),c.a.createElement(u.a,{placement:"top",isOpen:s.state["btnDeleteSource"+e.node.id],target:"btnDeleteSource"+e.node.id,toggle:function(){s.setState(Object(l.a)({},"btnDeleteSource"+e.node.id,!s.state["btnDeleteSource"+e.node.id]))}},"Delete Source"))]}},canDrag:!0,tableOptions:[]},s}return Object(s.a)(a,[{key:"componentWillMount",value:function(){this.optionTableGet()}},{key:"render",value:function(){var e=this;return c.a.createElement("div",{style:{height:400}},c.a.createElement("div",null,c.a.createElement(m.a,{color:"light",id:"btnSourceAdd",className:"btn-pill",onClick:this.sourceAdd},"\xa0",c.a.createElement("i",{className:"fa fa-plus-square"}),"\xa0",c.a.createElement("span",null,"Add Source\xa0")),c.a.createElement(m.a,{color:"info",id:"btnReset",className:"btn-pill",onClick:this.previewSources},"\xa0\xa0",c.a.createElement("i",{className:"fa fa-laptop"}),"\xa0",c.a.createElement("span",null,"Preview\xa0\xa0")),c.a.createElement(m.a,{color:"dark",id:"btnReset",className:"btn-pill"},"\xa0\xa0\xa0\xa0",c.a.createElement("i",{className:"fa fa-undo"}),"\xa0",c.a.createElement("span",null,"Reset\xa0\xa0\xa0\xa0")),c.a.createElement(m.a,{color:"success",id:"btnSave",className:"btn-pill"},"\xa0\xa0\xa0\xa0\xa0",c.a.createElement("i",{className:"fa fa-save"}),"\xa0",c.a.createElement("span",null,"Save\xa0\xa0\xa0\xa0\xa0"))),c.a.createElement(b.a,null,"\xa0"),c.a.createElement(b.a,null,c.a.createElement(f.a,{className:"col-md-4"},c.a.createElement(r.a,{treeData:this.state.sourceTree_Data,onChange:function(t){return e.changeChecking(t)},onMoveNode:function(t){return e.modifyButton(t)},generateNodeProps:this.state.generateNodeProps,maxDepth:2,rowHeight:50,slideRegionSize:20,scaffoldBlockPxWidth:25,canDrag:this.state.canDrag,isVirtualized:!1,theme:O.a})),c.a.createElement(f.a,{className:"col-md-8",id:"sidePanel"},c.a.createElement(j.a,{panel:this.state.selPanel,id:this.state.selId,updateParentState:this.updateParentState,updateNode:this.updateNode,treeData:this.state.sourceTree_Data,filterData:this.state["filter_Data"+this.state.selId],fieldData:this.state["field_Data"+this.state.selId],sortData:this.state["sort_Data"+this.state.selId],keyData:this.state["key_Data"+this.state.selId],sourceField_Items:this.state["sourceField_Items"+this.state.selId],filterField_Items:this.state["filterField_Items"+this.state.selId],sortField_Items:this.state["sortField_Items"+this.state.seldId],keyField_Items:this.state["keyField_Items"+this.state.selId]}))),c.a.createElement(p.a,{isOpen:this.state.source_Modal,toggle:this.toggleModalSource,className:"modal-lg "+this.props.className},c.a.createElement(h.a,null,c.a.createElement(g.a,null,c.a.createElement(E.a,null,c.a.createElement("strong",null,"Add New Source")),c.a.createElement(S.a,null,c.a.createElement(_.a,{action:"",method:"post",encType:"multipart/form-data",className:"form-horizontal"},c.a.createElement(D.a,{row:!0},c.a.createElement(f.a,{xs:"12",md:"12"},c.a.createElement(T.a,{type:"text",id:"sourcename",name:"sourcename_Input",valid:this.state.sourcename_Input_Valid,invalid:this.state.sourcename_Input_Invalid,placeholder:"Please input sourcename",value:this.state.sourcename_Input,onChange:this.handleChange}),c.a.createElement(v.a,null,this.state.sourcename_Input_InvalidMsg))))),c.a.createElement(I.a,{align:"right"},c.a.createElement(m.a,{color:"secondary",onClick:this.sourceAddCancel},c.a.createElement("i",{className:"fa fa-close"}),"\xa0Cancel"),"\xa0",c.a.createElement(m.a,{color:"primary",onClick:this.sourceAddSave},"\xa0",c.a.createElement("i",{className:"fa fa-arrow-right"}),"\xa0Next\xa0")," ")))),c.a.createElement(p.a,{isOpen:this.state.table_Modal,toggle:this.toggleModalTable,className:"modal-lg "+this.props.className},c.a.createElement(h.a,null,c.a.createElement(g.a,null,c.a.createElement(E.a,null,c.a.createElement("strong",null,c.a.createElement("i",{className:"fa fa-table"}),"\xa0Add New Table")),c.a.createElement(S.a,null,c.a.createElement(_.a,{action:"",method:"post",encType:"multipart/form-data",className:"form-horizontal"},c.a.createElement(D.a,{row:!0},c.a.createElement(f.a,{md:"2"},c.a.createElement(N.a,null,"Category")),c.a.createElement(f.a,{xs:"12",md:"10"},c.a.createElement(T.a,{type:"select",name:"selecttablecat",id:"selecttablecat",value:this.state.selTableCat,onChange:this.handleSelectTableCatChange},c.a.createElement("option",{value:""},"ALL"),this.state.tableCat_Items.map(function(e){return c.a.createElement("option",{key:e.tblcat_code,value:e.tblcat_code},e.tblcat_name," - ",e.tblcat_desc)})))),c.a.createElement(D.a,{row:!0},c.a.createElement(f.a,{md:"2"},c.a.createElement(N.a,null,"Table")),c.a.createElement(f.a,{xs:"12",md:"10"},c.a.createElement(k.a,{items:this.state.table_Items,selectedItems:this.state.selTableItems,onChange:this.handleMultiSelectChange,height:300,responsiveHeight:"300px",itemHeight:30}),c.a.createElement(v.a,null,this.state.sourcename_Input_InvalidMsg))))),c.a.createElement(I.a,{align:"right"},c.a.createElement(m.a,{color:"secondary",onClick:this.tableAddCancel},c.a.createElement("i",{className:"fa fa-close"}),"\xa0Cancel"),"\xa0",c.a.createElement(m.a,{color:"primary",onClick:this.tableAddSave},"\xa0",c.a.createElement("i",{className:"fa fa-arrow-right"}),"\xa0Next\xa0")," ")))),c.a.createElement(p.a,{isOpen:this.state.preview_Modal,toggle:this.toggleModalPreview,className:"modal-lg "+this.props.className},c.a.createElement(h.a,null,c.a.createElement(g.a,null,c.a.createElement(E.a,null,c.a.createElement("strong",null,c.a.createElement("i",{className:"fa fa-search"}),"\xa0SQL Script Preview")),c.a.createElement(S.a,null,this.state.previewSql_Data),c.a.createElement(I.a,null,c.a.createElement(m.a,{color:"secondary",onClick:this.previewClose},c.a.createElement("i",{className:"fa fa-close"}),"\xa0Close"),"\xa0")))))}}]),a}(d.Component)}}]);
//# sourceMappingURL=9.f6a26523.chunk.js.map