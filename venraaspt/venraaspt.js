/*venraas string definition*/
var venstrob = {
	v: '1.4.2',
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
	strtoken:'x',
	strtypeInit: '0',
	strtypeTracking: '1',
	strtypeEctrans:'2',
	strtypeGuid:'3',
	strtypeSession:'4',
	venfloctl_processing:'',
	strDhermesHost:'apih.venraas.tw',
	strDHermesApi:'/hermes/api/goods/rank',
	strCupidHost:'apir.venraas.tw',
	strCupidKeywordApi:'/cupid/api/goods/keywords',
	strCupidApi:'/cupid/api/goods/rank'
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
		try{
			if(expirestime == 0){
				document.cookie = name + "=" + escape(value) +";Path=/" + ((venstrob.strdn !== 'x') ? ";domain="+venstrob.strdn:'');
			}else{
				var expires = new Date();    
				// 7 days,  7*24*60*60*1000 = 604800000
				expires.setTime(expires.getTime() + expirestime);
				document.cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString()+";Path=/"+ ((venstrob.strdn !== 'x') ? ";domain="+venstrob.strdn:'');
				//console.log('debug in doCookieSetup(): done');
			}
		} catch(e){}
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
	xhr: (
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
			),
	getvenuuid: function(type, f_idx){
		var venraasxhr;
		try{
			var _param="?id="+top.location.host+"&typ="+type+'&pt=a';
			
			if(window.XDomainRequest && (navigator.userAgent.indexOf("MSIE 8.0")>0 || navigator.userAgent.indexOf("MSIE 9.0")>0) ){
				/*venraasxhr=new XDomainRequest();
				if(venraasxhr){
					console.log('debug in getvenuuid xdr send');
					venraasxhr.open("GET",('https:' == document.location.protocol ? 'https://' : 'http://')+venstrob.strserver+venstrob.struuidapi+_param);
					venraasxhr.timeout=1000;
					venraasxhr.onerror=function(){console.log("getvenuuid fail"); };
					venraasxhr.ontimeout=function(){console.log("getvenuuid fail"); };
					venraasxhr.onprogress=function() {};
					venraasxhr.onload= function(){
						console.log('debug in xdr onload:'+venraasxhr.responseText); 
						vencontrob.vencookiecontr(type,venraasxhr.responseText);
						if(type=="s"){
							vencontrob.actioncontroller(f_idx);
						}else {
							venfloctl[]["status"]=true;
							}
					};
					venraasxhr.send();
				}*/
				venstrob.venfloctl_processing = f_idx;
				venraastool.ven_jsonp('https://'+venstrob.strserver+ venstrob.struuidapi +_param+'&cbk=y');
			} else if(navigator.userAgent.indexOf("MSIE 7.0")>0 || navigator.userAgent.indexOf("MSIE 6.0")>0){
					venstrob.venfloctl_processing = f_idx;
					venraastool.ven_jsonp('https://'+venstrob.strserver+ venstrob.struuidapi +_param+'&cbk=y');
			}else{
				var venraasxhr= venraastool.xhr();
				venraasxhr.open("GET",'https://'+venstrob.strserver+venstrob.struuidapi+_param,true);
				venraasxhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");
				venraasxhr.withCredentials = true;
				venraasxhr.onreadystatechange=function(){
					try{
						if (venraasxhr.readyState==4 && venraasxhr.status==200){
							vencontrob.vencookiecontr(type,venraasxhr.responseText);
							if(type=="s"){
								vencontrob.actioncontroller(f_idx);
							}else {
								venfloctl[f_idx]["status"]=true;
							}
						}
					}
					catch(e){}
				};
				venraasxhr.send();
			}
		}catch(e) {}
	},
	isarray: function(v){
		return !!v && typeof v === 'object' && typeof v.length === 'number' && typeof v.splice === 'function' && !(v.propertyIsEnumerable('length'));
	},
	ven_jsonp: function(src){
		try{
			var vjsonp = document.createElement('script');
			vjsonp.setAttribute('src', src);
			document.body.appendChild(vjsonp);
		}catch(e){}
	},
	recomd: function(paramJson, cbf) {
		var ven_guid = venraastool.getcookie("venguid");
		if ("" == ven_guid) {
//			console.log('debug in venguid is not exist');
			if(typeof venfloctl !== 'undefined'){
				var venfloctl_size= venraastool.object_size(venfloctl);
				venfloctl[venfloctl_size]={};
				venfloctl[venfloctl_size]["status"]=false;
				venfloctl[venfloctl_size]["contr"]="";
				venfloctl[venfloctl_size]["venact"]="";
				venfloctl[venfloctl_size]["objv"]="";
				venfloctl[venfloctl_size]["type"]=venstrob.strtypeGuid;
				venfloctl[venfloctl_size]["retry"]=0;
				venraas.ven_cps(venfloctl_size);
			}
		}
		
		var ven_session = venraastool.getcookie("vensession");
		if("" == ven_session) {
//			console.log('debug in vesession is not exist');			
			if(typeof venfloctl !== 'undefined'){
				var venfloctl_size= venraastool.object_size(venfloctl);
				venfloctl[venfloctl_size]={};
				venfloctl[venfloctl_size]["status"]=false;
				venfloctl[venfloctl_size]["contr"]="";
				venfloctl[venfloctl_size]["venact"]="";
				venfloctl[venfloctl_size]["objv"]="";
				venfloctl[venfloctl_size]["type"]=venstrob.strtypeSession;
				venfloctl[venfloctl_size]["retry"]=0;
				venraas.ven_cps(venfloctl_size);
			}
		}		
		
		paramJson.ven_guid = ven_guid;
		paramJson.ven_session = ven_session;
		
		var venraasxhr = venraastool.xhr();
		venraasxhr.onreadystatechange = function() {
			try {
				if (this.readyState==4 && this.status==200) {					
					cbf(this.responseText);
				}
			}
			catch(e) {
				console.log(e.message);
			}
		};
		
		if (paramJson.hasOwnProperty('goods_keywords')) {
			paramJson.rec_logic = {"logic_list":[{"logic_name":"ClickStream","alg_list":[{"alg_name":"I2I_Model","model_type":"cooc_i2i","weight":1},{"alg_name":"I2I_Model","model_type":"content_i2i","weight":1}],"num_of_ref_cs":1,"random_cs_order":false,"filter_out_last_7_day_bought_items":true,"cs_must_in_current_categ_code":true,"use_all_alg_rec_gids":true,"weight_of_alg_rec_gids_size":1.5,"insert_cs_item_to_rec_items_first":false,"sort_by_socre":true,"add_key_terms_score":true},{"logic_name":"WhiteCategory","filter_out_last_7_day_bought_items":true,"weight_of_alg_rec_gids_size":1.5},{"logic_name":"ClickStream","alg_list":[{"alg_name":"I2I_Model","model_type":"cooc_i2i","weight":1}],"num_of_ref_cs":5,"random_cs_order":true,"filter_out_last_7_day_bought_items":true,"cs_must_in_current_categ_code":false,"use_all_alg_rec_gids":false,"weight_of_alg_rec_gids_size":1.5,"insert_cs_item_to_rec_items_first":true,"sort_by_socre":false},{"logic_name":"CurrentItem","alg_list":[{"alg_name":"GlobalTP"}],"filter_out_last_7_day_bought_items":true,"weight_of_alg_rec_gids_size":1.5,"sort_by_socre":false}]};
			venraasxhr.open('POST', 'https://' + venstrob.strCupidHost + venstrob.strCupidApi, true);
			console.log('https://' + venstrob.strCupidHost + venstrob.strCupidApi);
		}
		else {
			venraasxhr.open('POST', 'https://' + venstrob.strDhermesHost + venstrob.strDHermesApi, true);
			console.log('https://' + venstrob.strDhermesHost + venstrob.strDHermesApi);
		}
		venraasxhr.setRequestHeader("Content-type","application/json; charset=UTF-8");
		venraasxhr.withCredentials = true;

		var jsonStr = JSON.stringify(paramJson);		
		venraasxhr.send(jsonStr);
		
	},
	goods_keywords: function(paramJson, cbf) {
		var venraasxhr = venraastool.xhr();
		venraasxhr.onreadystatechange = function() {
			try {
				if (this.readyState==4 && this.status==200) {					
					cbf(this.responseText);
				}
			}
			catch(e) {
				console.log(e.message);
			}
		};		
		venraasxhr.open('POST', 'https://' + venstrob.strCupidHost + venstrob.strCupidKeywordApi, true);
		venraasxhr.setRequestHeader("Content-type","application/json; charset=UTF-8");
		venraasxhr.withCredentials = true;

		var jsonStr = JSON.stringify(paramJson);		
		venraasxhr.send(jsonStr);
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
		this.setpdata(venact,'token',venstrob.strtoken);
		this.setpdata(venact,'tophost',top.location.host);
		this.setpdata(venact,'referrer',document.referrer);
		//IE 8 is not support Date().now()
		try{
			this.setpdata(venact,'client_tzo',(new Date()).getTimezoneOffset());
			this.setpdata(venact,'client_utc',(new Date()).getTime());
		} catch(e){}
		
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
		var venraasxhr;
		var p_str = venraastool.urlparamfactory(_idx,this.pdata);
		if(p_str !== ""){
			try {
				if(window.XDomainRequest && (navigator.userAgent.indexOf("MSIE 8.0")>0 || navigator.userAgent.indexOf("MSIE 9.0")>0) ){
					/*venraasxhr=new XDomainRequest();
					if(venraasxhr){
						//console.log('debug in apirequest xdr send');
						venraasxhr.open("POST",('https:' == document.location.protocol ? 'https://' : 'http://')+venstrob.strserver+venstrob.strlogapi);
						venraasxhr.timeout=1000;
						venraasxhr.onerror=function(){console.log("venraas log fail"); };
						venraasxhr.ontimeout=function(){console.log("venraas log fail"); };
						venraasxhr.onprogress=function() {};
						venraasxhr.onload= function(){vencontrob.delpdata(_idx);};
						venraasxhr.send(p_str);
					}*/
					venraastool.ven_jsonp('https://'+venstrob.strserver+venstrob.strlogapi+'?'+p_str);
				} else if(navigator.userAgent.indexOf("MSIE 7.0")>0 || navigator.userAgent.indexOf("MSIE 6.0")>0){
					//console.log("IE7 IE6");
					venraastool.ven_jsonp('https://'+venstrob.strserver+venstrob.strlogapi+'?'+p_str);
				}
				else {
					venraasxhr = venraastool.xhr();
					//venraasxhr.open("POST",('https:' == document.location.protocol ? 'https://' : 'http://')+venstrob.strserver+venstrob.strlogapi,true);
					venraasxhr.open("POST",'https://'+venstrob.strserver+venstrob.strlogapi,true);
					venraasxhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");
					venraasxhr.withCredentials = true;
					venraasxhr.onreadystatechange=function(){
						try{
							if (venraasxhr.readyState==4 && venraasxhr.status==200){
								//console.log('xhr.readyState=',venraasxhr.readyState);
								//console.log('xhr.status=',venraasxhr.status);
								//console.log('response=',venraasxhr.responseText);
								//delete obj console.log('send log...'+venact);
								//vencontrob.delpdata(_idx);
							}
						}
						catch(e){}
					};
					//console.log('debug in xhr send');
					venraasxhr.send(p_str);
				}
			}catch(e) {}
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
	},
	vencookiecontr: function(type, responseText){
		if(type=="g"){
			venraastool.doCookieSetup("venguid",responseText,315360000000);
			//console.log('set g venguid cookie'+responseText);
		} else if(type=="s"){
			venraastool.doCookieSetup("vensession",responseText,1800000);
			//console.log('set s vensession cookie'+responseText);
		}
	}
};

function vengujsonpcallbk(type,data){
	//console.log('debug in vengujsonpcallbk('+type+','+data+'):' +venstrob.venfloctl_processing);
	try{
		vencontrob.vencookiecontr(type,data);
		if(type=="s"){
			vencontrob.actioncontroller(venstrob.venfloctl_processing);
		} else {
			venfloctl[venstrob.venfloctl_processing]["status"]=true;
		}
	}
	catch(e){}

};

/*application interface of venraas usage*/
var venraas = {
	init: function(isetting){
		try{
			if(typeof isetting !=='undefined' && typeof isetting.domainName !=='undefined')
				venstrob.strdn=isetting.domainName;
			if(typeof isetting !=='undefined' && typeof isetting.token !=='undefined')
				venstrob.strtoken=isetting.token;
			
			var ck_iframe = document.getElementById('venraasfr');
			if(ck_iframe === null){
				var venguid = document.createElement('iframe');
				venguid.setAttribute('id','venraasfr');
				venguid.style.display = "none";
				venguid.style.width = "1px";
				venguid.style.height = "1px";
				venguid.style.border ="0px";
				venguid.style.padding ="0px";
				venguid.style.margin ="0px";
				venguid.src = 'https://'+venstrob.strserver+venstrob.struuidapi;
				
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
			}
			
			//set ven_guid if not exists
			if(venraastool.getcookie("venguid") == ""){
				if(typeof venfloctl !== 'undefined'){
					var venfloctl_size= venraastool.object_size(venfloctl);
					venfloctl[venfloctl_size]={};
					venfloctl[venfloctl_size]["status"]=false;
					venfloctl[venfloctl_size]["contr"]="";
					venfloctl[venfloctl_size]["venact"]="";
					venfloctl[venfloctl_size]["objv"]="";
					venfloctl[venfloctl_size]["type"]=venstrob.strtypeGuid;
					venfloctl[venfloctl_size]["retry"]=0;
					this.ven_cps(venfloctl_size);
				}
				//venraastool.getvenuuid("g");
			}
		}
		catch(e){}
	},
	tracking: function(comd,objv){
		try{
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
		}
		catch(e){}
		
		
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
		try{
			if(f_idx == 0 || venfloctl[f_idx-1]["status"] ){
				//console.log('debug in ven_cps: ven_tracking - '+f_idx);
				switch(venfloctl[f_idx]["type"]){
					case venstrob.strtypeTracking:
						venraas.ven_tracking(f_idx);
						break;
					case venstrob.strtypeEctrans:
						venraas.ven_ecTransaction(f_idx);
						break;
					case venstrob.strtypeGuid:
						venraastool.getvenuuid("g",f_idx);
						break;
					case venstrob.strtypeSession:
						venraastool.getvenuuid("s",f_idx);
						break;
					default:
						break;
				}
				
			} else{
				//console.log('debug in ven_cps: '+f_idx+' '+ venfloctl[f_idx-1]["status"] );
				if(venfloctl[f_idx]["retry"] < 3){
					venfloctl[f_idx]["retry"]++;
					//console.log('debug in ven_cps: setTimeout -'+f_idx +' count- '+venfloctl[f_idx]["retry"]);
					setTimeout("venraas.ven_cps("+f_idx+")",100);
				}
				
			}
		}
		catch(e){}
	},
	ecTransaction: function(comd,objv){
		try{
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
		}
		catch(e){}
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
