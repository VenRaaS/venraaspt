/*venraas string definition*/
var venstrob = {
	v: '1.15',
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
	strnull: 'ven_null',
	strdn:'x',
	strtypeTracking: '1',
	strtypeEctrans:'2'
};
var venfloctl = new Object();

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
			document.cookie = name + "=" + escape(value) +";Path=/" + ((venstrob.strdn !== 'x') ? ";domain="+venstrob.strdn:'');
		}else{
			var expires = new Date();    
			// 7 days,  7*24*60*60*1000 = 604800000
			expires.setTime(expires.getTime() + expirestime);    
			document.cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString()+";Path=/"+ ((venstrob.strdn !== 'x') ? ";domain="+venstrob.strdn:'');
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
	getvenuuid: function(type, f_idx){
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
					vencontrob.actioncontroller(f_idx);
				}
			}
			if(typeof f_idx !=='undefined' && f_idx > -1){
				venfloctl[f_idx]["status"] = true;
			}
		};
		thexhr.send();
	},
	isarray: function(v){
		return !!v && typeof v === 'object' && typeof v.length === 'number' && typeof v.splice === 'function' && !(v.propertyIsEnumerable('length'));
	}
};

/*venraas controller object*/
var vencontrob = {
	createcontr: function(venact,objv){
		this.creadata(venact);
		this.setpdata(venact,venstrob.stract,venact);
		this.addcontr(venact,objv);
		//console.log('debug in createcontr(): '+this.pdata);
	},
	addcontr: function(venact,objv){
		//console.log('debug in addcontr()');
		for(var _k in objv){
			this.setpdata(venact,_k,objv[_k]);
		}
	},
	addrecitemcontr: function(venact,objv){
		//if(typeof this.pdata[venact]['now_rec'] != 'object')
			//this.pdata[venact]['now_rec']={};
		//var x = venraastool.object_size(this.pdata[venact]['now_rec']);
		if(!venraastool.isarray(this.pdata[venact]['now_rec'])){
			this.pdata[venact]['now_rec']=new Array();
			//console.log('debug in [now_rec] is new Array');
		}
		var x = this.pdata[venact]['now_rec'].length;
		//console.log('debug in [now_rec] lenght= '+x);
		this.pdata[venact]['now_rec'][x]=objv;
	},
	addtritemcontr: function(venact,objv){
		if(!venraastool.isarray(this.pdata[venact]['trans_i']['ilist'])){
			this.pdata[venact]['trans_i']['ilist']=new Array();
			//console.log('debug in [tran_i][ilist] is new Array');
		}
		var x = this.pdata[venact]['trans_i']['ilist'].length;
		//console.log('debug in [tran_i][ilist] lenght= '+x);
		this.pdata[venact]['trans_i']['ilist'][x]=objv;
	},
	sendcontr: function(venact){
		//console.log('debug in sendcontr()');
		if(venact == venstrob.strall){
			this.apirequest(venstrob.strnull);
		}
		else{	
			this.apirequest(venact);
		}
	},
	autoretrieve: function (venact){
		this.setpdata(venact,'para',location.search);
		this.setpdata(venact,'uri',location.pathname);
		this.setpdata(venact,'client_host',venstrob.strdn);
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
		//console.log('debug in creadata()');
		this.pdata[_i]={};
	},
	setpdata: function(_i,_k,_v){
		//console.log('debug in setpdata(): '+_i+' '+_k+' '+_v);
		if(typeof this.pdata[_i] !='undefined')
			this.pdata[_i][_k]=_v;
		else{
			this.pdata[_i]={};
			this.pdata[_i][_k]=_v;
		}
	},
	delpdata: function(_idx){
		//console.log('debug in delpdata()');
		if(_idx == venstrob.strnull){
			this.pdata={};
		} else {
			//delete this.pdata[_idx];
			this.pdata[_idx]={};
		}
		//console.log(JSON.stringify(this.pdata));
	},
	apirequest : function(_idx){
		//console.log('debug in apirequest()');
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
			//console.log('debug in xhr send');
			venraasxhr.send(p_str);
		}	
	},
	actioncontroller: function(f_idx){
		var contr = venfloctl[f_idx]["contr"];
		var venact= venfloctl[f_idx]["venact"];
		var objv = venfloctl[f_idx]["objv"];
		switch (contr){
			case venstrob.strcrt:
				//console.log('debug in create controller');
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
				//console.log('debug in send controller');
				vencontrob.sendcontr(venact);
				break;
			
			case venstrob.strrec:
				vencontrob.addrecitemcontr(venact,objv);
				break;
			default:
				//console.log(venstrob.strwarn+':input exception');
				break;
		}
		venfloctl[f_idx]["status"]=true;
	}
};

/*application interface of venraas usage*/
var venraas = {
	init: function(isetting){
		if(typeof isetting !=='undefined' && typeof isetting.domainName !=='undefined')
			venstrob.strdn=isetting.domainName;
		
		var venguid = document.createElement('iframe');
		//venguid.setAttribute("id", "venuuid");
		venguid.style.visibility="hidde";
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
		
		if(typeof isetting =='undefined' || typeof isetting.tagID == 'undefined'){
			document.body.appendChild(venguid);
			//console.log('here is init with body');
		}
		else{
			if(document.getElementById(isetting.tagID) !== null){
				//console.log('here is init with specific tag');
				document.getElementById(isetting.tagID).appendChild(venguid);
			}
			else{
				console.log('[Error] venraas document.getElementById('+isetting.tagID+') is not exist!');
			}
		}
		//set ven_guid if not exists
		if(venraastool.getcookie("venguid") == ""){
			venraastool.getvenuuid("g");
		}

	},
	tracking: function(comd,objv){
		//console.log("debug in "+comd);
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
		
		if(typeof venfloctl !== 'undefined'){
			var venfloctl_size= venraastool.object_size(venfloctl);
			venfloctl[venfloctl_size]={};
			venfloctl[venfloctl_size]["status"]=false;
			venfloctl[venfloctl_size]["contr"]=contr;
			venfloctl[venfloctl_size]["venact"]=venact;
			venfloctl[venfloctl_size]["objv"]=objv;
			venfloctl[venfloctl_size]["type"]=venstrob.strtypeTracking;
			venfloctl[venfloctl_size]["retry"]=0;
			//console.log('debug in venfloctl['+ venfloctl_size+'] '+contr +' '+ venact);
			this.ven_cps(venfloctl_size);
		}
	},
	ven_tracking: function(f_idx){
		//set ven_session if not exists
		if(venraastool.getcookie("vensession") == ""){
			//console.log('debug in vesession is not exist');
			//if session not exist, ask a session value first, then send log later. 
			venraastool.getvenuuid("s", f_idx);
		} else {
			//reset expirestime
			//console.log('debug in re-set venraas session cookie');
			venraastool.doCookieSetup("vensession",venraastool.getcookie("vensession"),1800000);
			//send log
			//console.log('debug in action controller');
			vencontrob.actioncontroller(f_idx);
			
		}
	},
	ven_cps: function(f_idx){
		
		if(f_idx == 0 || venfloctl[f_idx-1]["status"] ){
			//console.log('debug in ven_cps: ven_tracking - '+f_idx);
			switch(venfloctl[f_idx]["type"]){
				case venstrob.strtypeTracking:
					venraas.ven_tracking(f_idx);
					break;
				case venstrob.strtypeEctrans:
					venraas.ven_ecTransaction(f_idx);
					break;
				default:
					break;
			}
			
		} else{
			//console.log('debug in ven_cps: '+f_idx+' '+ venfloctl[f_idx-1]["status"] );
			if(venfloctl[f_idx]["retry"] < 50){
				venfloctl[f_idx]["retry"]++;
				//console.log('debug in ven_cps: setTimeout -'+f_idx +' count- '+venfloctl[f_idx]["retry"]);
				setTimeout("venraas.ven_cps("+f_idx+")",100);
			}
			
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
		
		if(typeof venfloctl !== 'undefined'){
			var venfloctl_size= venraastool.object_size(venfloctl);
			venfloctl[venfloctl_size]={};
			venfloctl[venfloctl_size]["status"]=false;
			venfloctl[venfloctl_size]["contr"]=contr;
			venfloctl[venfloctl_size]["venact"]=venact;
			venfloctl[venfloctl_size]["objv"]=objv;
			venfloctl[venfloctl_size]["type"]=venstrob.strtypeEctrans;
			venfloctl[venfloctl_size]["retry"]=0;
			//console.log('debug in venfloctl['+ venfloctl_size+'] '+contr +' '+ venact);
			this.ven_cps(venfloctl_size);
		}
		

	},
	ven_ecTransaction: function(f_idx){
		var contr =venfloctl[f_idx]["contr"];
		var objv  =venfloctl[f_idx]["objv"];
		var venact=venfloctl[f_idx]["venact"];
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
		venfloctl[f_idx]["status"]=true;
	}
};
