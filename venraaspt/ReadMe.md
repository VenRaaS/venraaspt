#version 1.1
- venraas.init_uuid();
- venraas.tracking('${action}|create',${key-value object});
- venraas.tracking('${action}|add',${key-value object});
- venraas.tracking('${action}|add_rec',${key-value object});
- venraas.tracking('${action}|send');
- venraas.ecTransaction('${action}|add',{ 'id':'${action id}'  });
- venraas.ecTransaction('${action}|add_item',{ <br>
'id':'${product/goods id}',  // Require<br>
'rec':'${click product/goods from recommendation id}', // Optional <br>
'method':'${method of recommendation id}' // Optional <br>
});
