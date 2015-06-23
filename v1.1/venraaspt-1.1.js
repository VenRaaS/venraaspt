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
		var expires = new Date();    
		// 7 days,  7*24*60*60*1000 = 604800000
		expires.setTime(expires.getTime() + expirestime);    
		document.cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString();
	},
	dect_type: function(comd,objv){
		if(typeof comd != 'string'){
			console.log(venstrob.strwarn+':input exception. c1');
			return false;
		}
		if(typeof objv != 'object'){
			console.log(venstrob.strwarn+':input exception. c2');
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
	}
};
/*venraas string definition*/
var venstrob = {
	strserver: 'venraaslogs.cloudapp.net:8080',
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
	actcontr: function(venact,objv){
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
		venraasxhr.open("POST","http://"+venstrob.strserver+venstrob.strlogapi,true);
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
	}
};

/*application interface of venraas usage*/
var venraas = {
	init_uuid: function(tagID){
		var venguid = document.createElement('iframe');
		venguid.setAttribute("id", "venuuid");
		venguid.style.display = "none";
		venguid.src = "http://"+venstrob.strserver+venstrob.struuidapi+"?id="+top.location.host;
		
		if(typeof tagID =='undefined'){
			document.body.appendChild(venguid);
			console.log('here is init with body');
			}			
		else{
			document.getElementById(tagID).appendChild(venguid);
			console.log('here is init with specific tag');
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

		switch (contr){
			case venstrob.strcrt:
				var autosend=true;
				if(objv['autosend'] == false)
					autosend=false;
				//delete objv.autosend; 				
				vencontrob.actcontr(venact,objv);
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
				console.log(venstrob.strwarn+':input exception');
				break;
		
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
