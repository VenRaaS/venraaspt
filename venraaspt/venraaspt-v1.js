var venraastool = {
	/** a function to retrieve cookie value for venraas log**/
	getcookie: function (name){
		theCookie=document.cookie+";";
		name+= "=";
		start=theCookie.indexOf(name);
		if(start!=-1){
			end=theCookie.indexOf(";",start);
			return (theCookie.substring(start+name.length,end));
		}else{
			return "";
		}
	},
	doCookieSetup: function (name, value, expirestime) {
		if(expirestime == 0){
			document.cookie = name + "=" + escape(value) +";Path=/";
		}else{
			var expires = new Date();    
			// 7 days,  7*24*60*60*1000 = 604800000
			expires.setTime(expires.getTime() + expirestime);    
			document.cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString()+";Path=/";
		}
	},
	dect_type: function(comd,objv){
		if(typeof comd != 'string'){
			//console.log(venstrob.strwarn+':input exception. c1');
			return false;
		}
		if(typeof objv != 'object'){
			//console.log(venstrob.strwarn+':input exception. c2');
			return false;
		}
	},	
	object_size: function(obj){
		var element_count = 0;
		for (var e in obj) {
			if (obj.hasOwnProperty(e)) {
				element_count++;
			}
		}
		return element_count;
	},
	urlparamfactory: function(_idx,obj){
		var str = [];
		if(typeof obj != 'object')
			return "";
		
		if(_idx == venstrob.strnull){
			for (var _k in obj) {
			str.push( encodeURIComponent(_k)+"="+ encodeURIComponent(
			JSON.stringify(obj[_k])
			));
			}
		} else {
			str.push( encodeURIComponent(_idx)+"="+ encodeURIComponent(
			JSON.stringify(obj[_idx])
			));
		}

		return str.join("&");
	},
	getvenuuid: function(type, contr, venact, objv){
		var xhr = (
				(
					window.XMLHttpRequest &&
					(window.location.protocol !== "file:" || !window.ActiveXObject)
				) ?
				function() {
					return new window.XMLHttpRequest();
				} :
				function() {
					try {
						return new window.ActiveXObject("Microsoft.XMLHTTP");
					} catch(e) {}
				}
			);

		var thexhr= xhr();
		//var _param="?id="+top.location.host+"&typ="+type+('https:' == document.location.protocol ? '&pt=a' : '');
		//thexhr.open("GET",('https:' == document.location.protocol ? 'https://' : 'http://')+venstrob.strserver+venstrob.struuidapi+_param,true);
		var _param="?id="+top.location.host+"&typ="+type+'&pt=a';
		thexhr.open("GET",'https://'+venstrob.strserver+venstrob.struuidapi+_param,true);
		
		thexhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");
		thexhr.withCredentials = true;
		thexhr.onreadystatechange=function(){
			if (thexhr.readyState==4 && thexhr.status==200){
				//console.log('response=',thexhr.responseText);
				if(type=="g"){
					venraastool.doCookieSetup("venguid",thexhr.responseText,315360000000);
					//console.log('set venguid cookie');
				} else if(type=="s"){
					venraastool.doCookieSetup("vensession",thexhr.responseText,1800000);
					//console.log('set vensession cookie');
					vencontrob.actioncontroller(contr, venact, objv);
				}
				
			}
		};
		thexhr.send();
	}
};
/*venraas string definition*/
var venstrob = {
	v: '1',
	strserver: 'apid.venraas.tw',
	struuidapi:'/venapis/vengu',
	strlogapi: '/venapis/log',
	stract: 'action',
	strcrt: 'create',
	stradd: 'add',
	strrec: 'add_rec',
	stradi: 'add_item',
	strsnd: 'send',
	strall: 'all',
	strwarn: '[warning] venraas ',
	strnull: 'ven_null'
};
/*venraas controller object*/
var vencontrob = {
	createcontr: function(venact,objv){
		this.creadata(venact);
		this.setpdata(venact,venstrob.stract,venact);
		this.addcontr(venact,objv);
		//console.log(this.pdata);
	},
	addcontr: function(venact,objv){
		for(var _k in objv){
			this.setpdata(venact,_k,objv[_k]);
		}
	},
	addrecitemcontr: function(venact,objv){
		if(typeof this.pdata[venact]['now_rec'] != 'object')
			this.pdata[venact]['now_rec']={};
		var x = venraastool.object_size(this.pdata[venact]['now_rec']);
		this.pdata[venact]['now_rec'][x]=objv;
	},
	addtritemcontr: function(venact,objv){
		var x = venraastool.object_size(this.pdata[venact]['trans_i']['ilist']);
		this.pdata[venact]['trans_i']['ilist'][x]=objv;
	},
	sendcontr: function(venact){
		if(venact == venstrob.strall){
			this.apirequest();
		}
		else{	
			this.apirequest(venact);
		}
	},
	autoretrieve: function (venact){
		this.setpdata(venact,'para',location.search);
		this.setpdata(venact,'uri',location.pathname);
		this.setpdata(venact,'client_host',location.host);
		this.setpdata(venact,'tophost',top.location.host);
		this.setpdata(venact,'referrer',document.referrer);
		this.setpdata(venact,'client_utc',Date.now());
		this.setpdata(venact,'client_tzo',(new Date()).getTimezoneOffset());
		this.setpdata(venact,'ven_guid',venraastool.getcookie('venguid'));
		this.setpdata(venact,'ven_session',venraastool.getcookie('vensession'));
		/*this.setpdata(venact,'c_ga',venraastool.getcookie('_ga'));
		this.setpdata(venact,'c_utma',venraastool.getcookie('__utma'));*/
		this.setpdata(venact,'ver',venstrob.v);
	},
	pdata: new Object(),
	creadata: function(_i){
		this.pdata[_i]={};
	},
	setpdata: function(_i,_k,_v){
		if(typeof this.pdata[_i] !='undefined')
			this.pdata[_i][_k]=_v;
	},
	delpdata: function(_idx){
		if(_idx == venstrob.strnull){
			this.pdata={};
		} else {
			delete this.pdata[_idx];
		}
		//console.log(JSON.stringify(this.pdata));
	},
	apirequest : function(_idx){

		var xhr = (
				(
					window.XMLHttpRequest &&
					(window.location.protocol !== "file:" || !window.ActiveXObject)
				) ?
				function() {
					return new window.XMLHttpRequest();
				} :
				function() {
					try {
						return new window.ActiveXObject("Microsoft.XMLHTTP");
					} catch(e) {}
				}
			);
		
		var venraasxhr = xhr();
		//venraasxhr.open("POST",('https:' == document.location.protocol ? 'https://' : 'http://')+venstrob.strserver+venstrob.strlogapi,true);
		venraasxhr.open("POST",'https://'+venstrob.strserver+venstrob.strlogapi,true);
		venraasxhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");
		venraasxhr.withCredentials = true;
		venraasxhr.onreadystatechange=function(){
			if (venraasxhr.readyState==4 && venraasxhr.status==200){
				//console.log('xhr.readyState=',venraasxhr.readyState);
				//console.log('xhr.status=',venraasxhr.status);
				//console.log('response=',venraasxhr.responseText);
				//delete obj console.log('send log...'+venact);
				vencontrob.delpdata(_idx);
			}
		};
		var p_str = venraastool.urlparamfactory(_idx,this.pdata);
		if(p_str != ""){
			venraasxhr.send(p_str);
		}	
	},
	actioncontroller: function(contr, venact, objv){
		switch (contr){
			case venstrob.strcrt:
				var autosend=true;
				if(objv['autosend'] == false)
					autosend=false;
				//delete objv.autosend; 
				vencontrob.createcontr(venact,objv);
				vencontrob.autoretrieve(venact);
				if(autosend == true)
					vencontrob.sendcontr(venact);
				break;
				
			case venstrob.stradd:
				vencontrob.addcontr(venact,objv);
				break;
				
			case venstrob.strsnd:
				vencontrob.sendcontr(venact);
				break;
			
			case venstrob.strrec:
				vencontrob.addrecitemcontr(venact,objv);
				break;
			default:
				//console.log(venstrob.strwarn+':input exception');
				break;
		
		}
	}
};

/*application interface of venraas usage*/
var venraas = {
	init: function(tagID){
		var venguid = document.createElement('iframe');
		venguid.setAttribute("id", "venuuid");
		venguid.style.display = "none";
		venguid.style.width = "1px";
		venguid.style.height = "1px";
		venguid.style.border ="0px";
		venguid.style.padding ="0px";
		venguid.style.margin ="0px";
		//var _param="?id="+top.location.host+('https:' == document.location.protocol ? '&pt=a' : '');
		//venguid.src = ('https:' == document.location.protocol ? 'https://' : 'http://')+venstrob.strserver+venstrob.struuidapi+_param;
		var _param="?id="+top.location.host+'&pt=a';
		venguid.src = 'https://'+venstrob.strserver+venstrob.struuidapi+_param;
		
		if(typeof tagID =='undefined'){
			document.body.appendChild(venguid);
			//console.log('here is init with body');
		}
		else{
			document.getElementById(tagID).appendChild(venguid);
			//console.log('here is init with specific tag');
		}
		
		//set ven_guid if not exists
		if(venraastool.getcookie("venguid") == ""){
			venraastool.getvenuuid("g","","","");
		}

	},
	tracking: function(comd,objv){
		//injection detection
		
		//type detection
		if(typeof objv =='undefined') 
			objv={};
		if(venraastool.dect_type(comd,objv) == false)
			return ;

		//action routing
		var venact='';
		var contr='';
		if(comd.indexOf('|') > -1){
			cmdar=comd.split('|');
			venact=cmdar[0];
			contr=cmdar[1];
		} else{
			venact=venstrob.strall;
			contr=comd;
		}

		//set ven_session if not exists
		if(venraastool.getcookie("vensession") == ""){
			//if session not exist, ask a session value first, then send log later. 
			venraastool.getvenuuid("s", contr, venact, objv);
		} else {
			//reset expirestime
			venraastool.doCookieSetup("vensession",venraastool.getcookie("vensession"),1800000);
			//send log
			vencontrob.actioncontroller(contr, venact, objv);
		}

	},
	ecTransaction: function(comd,objv){
		//injection detection
		
		//type detection
		if(typeof objv =='undefined') 
			objv={};
		if(venraastool.dect_type(comd,objv) == false)
			return ;
			
		//action routing
		var venact='';
		var contr='';
		if(comd.indexOf('|') > -1){
			cmdar=comd.split('|');
			venact=cmdar[0];
			contr=cmdar[1];
		}
		
		switch (contr){
			case venstrob.stradd:
				objv['ilist']={};
				var trans_objv=new Object();
				trans_objv['trans_i']=objv;
				vencontrob.addcontr(venact,trans_objv);
				break;
				
			case venstrob.stradi:
				vencontrob.addtritemcontr(venact,objv);
				break;
				
			default:
				console.log(venstrob.strwarn+':input exception. c3');
				break;
		}
	}
};
