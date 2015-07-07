# venraaspt
A pt to forward VenRaaS
<pre><code>
(function() {
  
  
  var myVenraasLogs = function() {
    venraas.init_uuid();
    // Here callback, do venraas log here
    // Reference : https://github.com/VenRaaS/venraaspt/wiki/Using-Javascript-Tracking---'venraaspt'
  
};
  
var venraas_script = document.createElement('script'); 
venraas_script.type = 'text/javascript'; 
venraas_script.src = 
  ('https:' == document.location.protocol ? 'https://' : 'http://') + 
  'libs.venraas.tw/js/venraaspt.min.js';
venraas_script.async = true;
venraas_script.onreadystatechange = myVenraasLogs;
venraas_script.onload = myVenraasLogs;

var head = document.getElementsByTagName('head')[0];
head.appendChild(venraas_script);
  

 
 })();
</code></pre>
