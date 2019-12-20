/*venraas string definition*/
var venstrob = {
	v: '1.6.3',
	strserver: 'apid.friday.tw',
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
	strtypeRecomd:'5',
	venfloctl_processing:'',
	strDhermesHost:'apih.friday.tw',
	strDHermesApi:'/hermes/api/goods/rank',
	strCupidHost:'apir.friday.tw',
	strCupidKeywordApi:'/cupid/api/goods/keywords'
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
		var levelth = 3;

		try{
			if(expirestime == 0){
				document.cookie = name + "=" + escape(value) + ";Path=/" + ";domain=" + window.location.host.split('.').slice(-levelth).join('.');
			}else{
				var expires = new Date();
				// 7 days,  7*24*60*60*1000 = 604800000
				expires.setTime(expires.getTime() + expirestime);

				//-- set cookie to base domain, i.e. 3-level domain
				document.cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString() + ";Path=/" + ";domain=" + window.location.host.split('.').slice(-levelth).join('.');
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
			console.log("debug in xhr=window.XMLHttpRequest()");
			return new window.XMLHttpRequest();
		} :
		function() {
			try {
				console.log("debug in xhr=window.ActiveXObject(\"Microsoft.XMLHTTP\")");
				return new window.ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {}
		}
	),
	getvenuuid: function(type, f_idx){
		var venraasxhr;
		try{
			var _param="?id="+top.location.host+"&typ="+type+'&pt=a';

			if(window.XDomainRequest && (navigator.userAgent.indexOf("MSIE 8.0")>0 || navigator.userAgent.indexOf("MSIE 9.0")>0) ){
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
	hashCode: function(str) {
		var hash = 0;

		if (str.length === 0)
			return hash;

		for (var i = 0; i < str.length; i++) {
			var chr = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}

		return hash;
	},
	//-- update key info and wipe legacy keys, e.g. expiration time
	updateCachekeys: function(comToken, cacheKeyJson) {
		// e.g. 'venraas-token$TOKEN cache keys'
		var mgrKey = 'venraas-token' + comToken + ' cache keys';

		var current_timestamp = new Date().getTime();
		var keyInfo = {'key':cacheKeyJson, 'expires_timestamp': current_timestamp + 7*24*60*60*1000};

		//-- update or push a new one into keyInfos
		// get keyInfos with JSON form
		var keyInfosJson = localStorage.getItem(mgrKey);
		var keyInfos = [keyInfo];
		if (keyInfosJson) {
			var keyInfos = JSON.parse(keyInfosJson)
			var isExists = false;
			keyInfos.forEach(function(e, i, array) {
				if (e.key === cacheKeyJson) {
					array[i] = keyInfo;
					isExists = true;
				}});

			if (! isExists) {
				keyInfos.push(keyInfo);
			}

			// remove expires cache
			keyInfos.forEach(function(e, i, array) {
				if (e.expires_timestamp <= current_timestamp) {
					localStorage.removeItem(e.key);
				}});

			var nonExpires = keyInfos.filter(function(e) {
				return current_timestamp < e.expires_timestamp;
			});
			keyInfos = nonExpires;
		}
		localStorage.setItem(mgrKey, JSON.stringify(keyInfos));
	},
	getrecomd: function(f_idx){
		var paramObj = venfloctl[f_idx]["objv"]["param"];
		paramObj.ven_guid = venraastool.getcookie("venguid");
		paramObj.ven_session = venraastool.getcookie("vensession");
		var cbf = venfloctl[f_idx]["objv"]["callback"];

		//-- key of the recom'd response in localStorage
		var cacheKey = {
			'device':paramObj.device,
			'rec_pos': paramObj.rec_pos,
			'rec_type': paramObj.rec_type,
			'token': paramObj.token
		};
		var cacheKeyJson = JSON.stringify(cacheKey);

		var venraasxhr = venraastool.xhr();		
		venraasxhr.onreadystatechange = function() {
			try {
				if (this.readyState==4 && this.status==200) {
					cbf(this.responseText, paramObj);

					var recObj = JSON.parse(this.responseText);
					if (recObj.recomd_list && 0 < recObj.recomd_list.length) {
						//-- set recom'd response into localStorage
						localStorage.setItem(cacheKeyJson, this.responseText);

						venraastool.updateCachekeys(paramObj.token, cacheKeyJson);
					}

					venfloctl[f_idx]["status"] = true;
				}
			}
			catch(e) {
				console.log(e.message);
			}
		};

		venraasxhr.timeout = 2000;
		venraasxhr.ontimeout = function(e) {
			var lastRespText = localStorage.getItem(cacheKeyJson);
			if (lastRespText) {
				console.log('venraas recomd timeout! response the last result');
			}
			else {
				lastRespText = {};
				console.log('venraas recomd timeout! none of the last result');
			}
			
			cbf(lastRespText, paramObj);
		}

		venraasxhr.open('POST', 'https://' + venstrob.strDhermesHost + venstrob.strDHermesApi, true);
		venraasxhr.setRequestHeader("Content-type","application/json; charset=UTF-8");
		venraasxhr.withCredentials = true;

		var jsonStr = JSON.stringify(paramObj);
		venraasxhr.send(jsonStr);
	},
	saveLocalStorage: function(paramJson, responseText) {
		try {
			//-- key of the recom'd response in localStorage
			var cacheKey = {
				'device':paramJson.device,
				'rec_pos': paramJson.rec_pos,
				'rec_type': paramJson.rec_type,
				'token': paramJson.token
			};
			var cacheKeyJson = JSON.stringify(cacheKey);
			var recObj = JSON.parse(responseText);
			if (recObj.recomd_list && 0 < recObj.recomd_list.length) {
				//-- set recom'd response into localStorage
				localStorage.setItem(cacheKeyJson, responseText);

				venraastool.updateCachekeys(paramJson.token, cacheKeyJson);
			}
		}
		catch(e) {
			console.log(e.message);
		}
	},
	getLocalStorage: function(paramJson) {
		try {
			//-- key of the recom'd response in localStorage
			var cacheKey = {
				'device':paramJson.device,
				'rec_pos': paramJson.rec_pos,
				'rec_type': paramJson.rec_type,
				'token': paramJson.token
			};
			var cacheKeyJson = JSON.stringify(cacheKey);
			return localStorage.getItem(cacheKeyJson);
		}
		catch(e) {
			console.log(e.message);
		}
	},
	recomd: function(paramJson, cbf) {
		var ven_guid = venraastool.getcookie("venguid");
		if ("" == ven_guid) {
			console.log("debug in venguid is not exist");
			//venguid not exist, vensession not exist!

			//get guid
			var url_guid = "https://" + venstrob.strserver + venstrob.struuidapi + "?id=" + top.location.host + "&typ=g&pt=a";
			var xhr_guid = venraastool.xhr();
			xhr_guid.open("GET", url_guid, true);
			xhr_guid.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");

			xhr_guid.withCredentials = true;
			xhr_guid.onreadystatechange = function() {
			try {
				if (this.readyState == 4 && this.status == 200) {
					venraastool.doCookieSetup("venguid", this.responseText, 315360000000);
					ven_guid = this.responseText;

					//get session
					var url_session = "https://" + venstrob.strserver + venstrob.struuidapi + "?id=" + top.location.host + "&typ=s&pt=a";
					var xhr_session = venraastool.xhr();
					xhr_session.open("GET", url_session, true);
					xhr_session.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
					xhr_session.withCredentials = true;
					xhr_session.onreadystatechange = function() {
					try {
						if (this.readyState == 4 && this.status == 200) {
							venraastool.doCookieSetup("vensession", this.responseText, 1800000);
							ven_session = this.responseText;

							//get recomd
							var url_recomd = "https://" + venstrob.strDhermesHost + venstrob.strDHermesApi;
							paramJson.ven_guid = ven_guid;
							paramJson.ven_session = ven_session;

							var xhr_recomd = venraastool.xhr();
							xhr_recomd.open("POST", url_recomd, true);
							xhr_recomd.setRequestHeader("Content-type", "application/json; charset=UTF-8");
							xhr_recomd.withCredentials = true;
							xhr_recomd.onreadystatechange = function() {
							try {
								if (this.readyState == 4 && this.status == 200) {
									venraastool.saveLocalStorage(paramJson, this.responseText);
									cbf(this.responseText, paramJson);
								}
							}
							catch(e) {
								console.log(e.message);
							}
							};

							xhr_recomd.timeout = 2000;
							xhr_recomd.ontimeout = function(e) {
								var lastRespText = venraastool.getLocalStorage(paramJson);
								if (lastRespText) {
									console.log('venraas recomd timeout! response the last result');
								}
								else {
									lastRespText = {};
									console.log('venraas recomd timeout! none of the last result');
								}

								cbf(lastRespText, paramJson);
							}

							var jsonStr = JSON.stringify(paramJson);
							xhr_recomd.send(jsonStr);
						}
					}
					catch(e) {}
					};
					xhr_session.send();
				}
			}
			catch(e) {}
			};
			xhr_guid.send();

			return;
		}

		var ven_session = venraastool.getcookie("vensession");
		if ("" == ven_session) {
			console.log("debug in vensession is not exist");
			//vensession not exist
			var url_session = "https://" + venstrob.strserver + venstrob.struuidapi + "?id=" + top.location.host + "&typ=s&pt=a";
			var xhr_session = venraastool.xhr();
			xhr_session.open("GET", url_session, true);
			xhr_session.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
			xhr_session.withCredentials = true;
			xhr_session.onreadystatechange = function() {
			try {
				if (this.readyState == 4 && this.status == 200) {
					venraastool.doCookieSetup("vensession", this.responseText, 1800000);
					ven_session = this.responseText;

					//get recomd
					var url_recomd = "https://" + venstrob.strDhermesHost + venstrob.strDHermesApi;
					paramJson.ven_guid = ven_guid;
					paramJson.ven_session = ven_session;

					var xhr_recomd = venraastool.xhr();
					xhr_recomd.open("POST", url_recomd, true);
					xhr_recomd.setRequestHeader("Content-type", "application/json; charset=UTF-8");
					xhr_recomd.withCredentials = true;
					xhr_recomd.onreadystatechange = function() {
					try {
						if (this.readyState == 4 && this.status == 200) {
							venraastool.saveLocalStorage(paramJson, this.responseText);
							cbf(this.responseText, paramJson);
						}
					}
					catch(e) {
						console.log(e.message);
					}
					};

					xhr_recomd.timeout = 2000;
					xhr_recomd.ontimeout = function(e) {
						var lastRespText = venraastool.getLocalStorage(paramJson);
						if (lastRespText) {
							console.log('venraas recomd timeout! response the last result');
						}
						else {
							lastRespText = {};
							console.log('venraas recomd timeout! none of the last result');
						}

						cbf(lastRespText, paramJson);
					}

					var jsonStr = JSON.stringify(paramJson);
					xhr_recomd.send(jsonStr);
				}
			}
			catch(e) {}
			};
			xhr_session.send();

			return;
		}

		console.log("debug in venguid & vensession are exist");
		//get recomd
		var url_recomd = "https://" + venstrob.strDhermesHost + venstrob.strDHermesApi;
		paramJson.ven_guid = ven_guid;
		paramJson.ven_session = ven_session;

		var xhr_recomd = venraastool.xhr();
		xhr_recomd.open("POST", url_recomd, true);
		xhr_recomd.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr_recomd.withCredentials = true;
		xhr_recomd.onreadystatechange = function() {
		try {
			if (this.readyState == 4 && this.status == 200) {
				venraastool.saveLocalStorage(paramJson, this.responseText);
				cbf(this.responseText, paramJson);
			}
		}
		catch(e) {
			console.log(e.message);
		}
		};

		xhr_recomd.timeout = 2000;
		xhr_recomd.ontimeout = function(e) {
			if (lastRespText) {
				console.log('venraas recomd timeout! response the last result');
			}
			else {
				lastRespText = {};
				console.log('venraas recomd timeout! none of the last result');
			}

			cbf(lastRespText, paramJson);
		}

		var jsonStr = JSON.stringify(paramJson);
		xhr_recomd.send(jsonStr);
	},
	goods_keywords: function(paramObj, cbf) {
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

		var jsonStr = JSON.stringify(paramObj);
		venraasxhr.send(jsonStr);
	},
	get_paramValFromURL: function(paramName, url) {
		var rs = null;
		
		var dompath_paramstr = url.split('?',2);
		if (2 == dompath_paramstr.length) {
			var params = dompath_paramstr[1].split('&');
			for (var i = 0; i < params.length; ++i){
				var kv = params[i].split('=', 2);
				if (2 == kv.length) {
					if (paramName == kv[0]) {
						return decodeURIComponent(kv[1].replace(/\+/g, " "));
					}
				}
			}
		}

		return rs;
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
		var from_rec = this.getpdata(venact, 'from_rec');
		if (! from_rec || "null" == from_rec) {
			from_rec = venraastool.get_paramValFromURL('from_rec', location.href);
			if (from_rec) {
				this.setpdata(venact, 'from_rec', from_rec);
			}
		}
	},
	pdata: new Object(),
	creadata: function(_i){
		//console.log('debug in creadata()');
		this.pdata[_i]={};
	},
	getpdata: function(_i, _k){
		return (this.pdata[_i]) ? this.pdata[_i][_k] : undefined;
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
					case venstrob.strtypeRecomd:
						venraastool.getrecomd(f_idx)
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
