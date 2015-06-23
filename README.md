# venraaspt
A pt to forward VenRaaS
<pre><code>
(function() {
  
  
  var myVenraasCode = function() {

   // Here callback, do what ever you want
    
  
};
  
var venraas_script = document.createElement('script'); 
venraas_script.type = 'text/javascript'; 
venraas_script.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'lib.venraas.tw/js/venraaslog-0.1.js';
venraas_script.async = true;
  
  venraas_script.onreadystatechange = myVenraasCode;
  venraas_script.onload = myVenraasCode;

  
var head = document.getElementsByTagName('head')[0];
head.appendChild(venraas_script);
  

 
 })();
</code></pre>