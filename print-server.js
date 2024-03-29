let ListDocs = [], ListEstadistica = [], ipUrlLocal='', IntervalClearCola = null, IntervalLoadCola, ultimoId = 0, ultimoIdData, valRows=0, xsourceEventCola, xPausaError = false, _data_o = {};

$(document).ready(function() {
	ultimoId=0;
	getDataO();
	// 
	setTimeout(() => {
		$("body").addClass("loaded");
		// xInitPrintServer();
	}, 1000);	
	
	xPrepararData();
});

function getDataO() {
	// closeSocket();

	_data_o = getUrlParameter('o', '?');
	_data_o = JSON.parse(atob(_data_o));

		
	_data_o.isFromApp = 0; 
	openSocket(_data_o);
}

function xPrepararData() {	
	$.ajax({
		url: './bdphp/log_003.php?op=0',
		type: 'POST',
		data: _data_o
	})
	.done((res) => {
		ipUrlLocal = res;
		xUpdateEstructuras();
		xVerificarColaImpresion();
	})
}

// function xVerificarColaImpresion(){
// 	console.log(JSON.stringify(_data_o));
// 	const _urlEvent = './bdphp/log_003.php?op=201&u=' + ultimoId + '&data=' + JSON.stringify(_data_o);
// 	if(typeof(EventSource) !== "undefined") {
// 		xsourceEventCola = new EventSource(_urlEvent);
// 		xsourceEventCola.onmessage = function(event) {
// 			valRows = event.data === "" ? valRows : event.data;
// 			if (parseInt(valRows) > parseInt(ultimoId)) {
// 				ultimoIdData = event.data;
// 				xInitPrintServer();
// 			}
// 	        // if(event.data!==xValCountPedidos){xValCountPedidos=event.data;xActualizarItems();}
// 	    };
// 	}
// }

function xVerificarColaImpresion(){
	console.log(JSON.stringify(_data_o));
	const _urlEvent = './bdphp/log_003.php?op=201&u=' + ultimoId + '&data=' + JSON.stringify(_data_o);
	$.ajax({
		url: _urlEvent,
		type: 'GET',			
	})
	.done((res) => {
		ultimoIdData = res.data;
		xInitPrintServer();
	});	
}

function _printerComanda(data) {
	tdRowsPrint(data);
}

function xInitPrintServer() {
	// const _ultimoId = ListDocs.length === 0 ? '' : ultimoId;
	var dataSend = _data_o;
	dataSend.ultimoId = ultimoId;
	$.ajax({
		url: './bdphp/log_003.php?op=2',
		type: 'POST',	
		data: dataSend
	})
	.done((res) => {
		const _res = JSON.parse(res);
		let _ListDocumentos = _res.datos;

		/// agregar a la lista
		tdRowsPrint(_ListDocumentos);
		// let row = ListDocs.length;
		// let cadena_tr = '';

		// _ListDocumentos.map((x, index)=>{
		// 	ListDocs.push(x);		
		// 	ListEstadistica.push(x);

		// 	const id = x.idprint_server_detalle;			
		// 	let _detalle_json;
		// 	let _ip_print;
		// 	try {
		// 		_detalle_json = JSON.parse(x.detalle_json);
		// 		_ip_print = _detalle_json.Array_print[0].ip_print
				
		// 	} catch (error) {
		// 		try {
		// 			_detalle_json = JSON.parse(x.detalle_json.replace('"{', '{').replace('}"', '}'));
		// 			_ip_print = _detalle_json.Array_print[0].ip_print
		// 		}	
		// 		catch (error) {  
		// 			_detalle_json = null; 
		// 			_ip_print = 'error' 
		// 			console.log('log ', x.detalle_json);
		// 		}
		// 	}

		// 	row++;
		// 	cadena_tr += '<tr id="tr' + id +'">'+
		// 		'<td>'+ row +'</td>'+
		// 		'<td>' + x.hora + '</td>' +
		// 		'<td>' + x.descripcion_doc + '</td>' +
		// 		'<td>' + _ip_print + '</td>' +
		// 		'<td id="td_estado' + id +'">Pendiente</td>' +
		// 	'</tr>';
		// });

		// // xGenerarGrafico();


		// // let cadena_tr = '';				
		// // _ListDocumentos.map((x, index) => {			
		// // 	const id = x.idprint_server_detalle;			
		// // 	row++;
		// // 	cadena_tr += '<tr id="tr' + id +'">'+
		// // 		'<td>'+ row +'</td>'+
		// // 		'<td>' + x.hora + '</td>' +
		// // 		'<td>' + x.descripcion_doc + '</td>' +
		// // 		'<td id="td_estado' + id +'">Pendiente</td>' +
		// // 	'</tr>';
		// // });

		// $("#listDoc").append(cadena_tr).trigger('create');

		// ultimoId = ultimoIdData;
		// xSendPrint();
	});	  
}

function tdRowsPrint(_ListDocumentos) {
	let row = ListDocs.length;
		let cadena_tr = '';

		_ListDocumentos.map((x, index)=>{
			ListDocs.push(x);		
			ListEstadistica.push(x);

			const id = x.idprint_server_detalle;
			let _detalle_json;
			let _ip_print;
			try {
				_detalle_json = typeof x.detalle_json === 'object' ? x.detalle_json : JSON.parse(x.detalle_json);
				_ip_print = _detalle_json.Array_print[0].ip_print
				
			} catch (error) {
				try {
					_detalle_json = JSON.parse(x.detalle_json.replace('"{', '{').replace('}"', '}'));
					_ip_print = _detalle_json.Array_print[0].ip_print
				}	
				catch (error) {  
					_detalle_json = null; 
					_ip_print = 'error' 
					console.log('log error', x.detalle_json);
				}
			}

			row++;
			cadena_tr += '<tr id="tr' + id +'">'+
				'<td>'+ row +'</td>'+
				'<td>' + x.hora + '</td>' +
				'<td>' + x.descripcion_doc + '</td>' +
				'<td>' + _ip_print + '</td>' +
				'<td id="td_estado' + id +'">Pendiente</td>' +
			'</tr>';
		});


		$("#listDoc").append(cadena_tr).trigger('create');

		ultimoId = ultimoIdData;
		xSendPrint();
}

async function xSendPrint() {
	// const _listSend = ListDocs.map((x)=> {
	// ListDocs.filter(x => !x.xPausaError).map(async (x, index) => {
	for (let index = 0; index < ListDocs.length; index++) {
		let x = ListDocs[index];
		let _detalle_json;
		let rpt_p = '';
		
		const _id = x.idprint_server_detalle;
		if (x.impreso===1) continue;
		// if ( xPausaError ) return;
		if (x.error === 1) continue;

		try {
			_detalle_json = typeof x.detalle_json === 'object' ? x.detalle_json : JSON.parse(x.detalle_json.replace('"{', '{').replace('}"', '}'));
		} catch (error) {
			try {				
				_detalle_json = typeof x.detalle_json === 'object' ? x.detalle_json : JSON.parse(x.detalle_json);
			} catch (error) {
				x.error = 1;
				xUpdateEstadoError(_id);
				xErrorPrint(_id);
				return;
			}
		}
		
		let _nomUs = parseInt(x.idprint_server_estructura) === 3 ? '' : _detalle_json.Array_enca.nom_us === undefined ? _detalle_json.Array_enca[0].nom_us : _detalle_json.Array_enca.nom_us; // -> 
		_nomUs = _nomUs.split(' ')[0];
		
		const _listSend = { data: _detalle_json, nom_documento: x.nom_documento, nomUs:_nomUs, hora: x.hora };
		x.impreso=1;
		x.error = 0;
		x.quitar_lista = 0;
		// return { data: _detalle_json, nom_documento: x.nom_documento, nomUs: _nomUs };
		
		try {			
			rpt_p = await xSendPrintNow(_listSend, _id, index);
		} catch (err) {
			console.log(err.statusText);
		}


		// $.ajax({
		// 	url: ipUrlLocal+'/restobar/print/client/pruebas.print_url.php',
		// 	type: 'POST',
		// 	data: { arrData: _listSend }
		// })
		// .done((res) => {
		// 	// console.log(res);
		// 	xUpdateEstado(_id);
		// 	// return true;
		// })
		// .fail(function (e) {
		// 	xPausaError = true;
		// 	x.error = 1;
		// 	xUpdateEstadoError(_id);
		// 	xErrorPrint(_id);
		// 	// return false;
		// });

		console.log('rpt_p', rpt_p);

		
	};
	
}

async function xSendPrintNow(_listSend, _id, index) {
	var rpt_now;
	const nomFile = _listSend.nom_documento+ '.php';
	await $.ajax({
			url: ipUrlLocal + '/restobar/print/client/' + nomFile,
			type: 'POST',
			timeout: 4000,
			data: { arrData: _listSend },
			success: (res) => {
				if(res.indexOf('error') > -1) {
					xPausaError = true;
					ListDocs[index].error = 1;
					xUpdateEstadoError(_id);
					xErrorPrint(_id);
					rpt_now = false;				
				} else {					
					xUpdateEstado(_id);
					ListDocs[index].quitar_lista = 1;
					rpt_now = true;		
				}
			},
			error: (e, textStatus, msj) => {				
				xPausaError = true;
				ListDocs[index].error = 1;				
				xUpdateEstadoError(_id);
				xErrorPrint(_id);
				rpt_now = false;
				// return rpt_now;
				// e.abort();
			}
		});

		return rpt_now;
		console.log('rpt_p', rpt_p);
}


function xErrorPrint(_id) {	
	$("#div_error").removeClass('xInvisible');
	const nomTd = "#td_estado" + _id;
	$(nomTd).text('Error');
	$(nomTd).addClass('xRojo');
}

function xIntentarImprimirNuevamente() {
	location.reload();
}

function xEliminarPedidosError() {
	let arrListBorrar='';
	ListDocs.map((x) => {
		if (x.error === 0) return;

		const _id = x.idprint_server_detalle;
		x.error = 0;
		x.quitar_lista = 1;
		x.eliminado = true;	
		arrListBorrar += _id+',';
					
		const nomTd = "#td_estado" + _id;
		$(nomTd).text('Eliminado');
		$(nomTd).addClass('xRojo');
		if (IntervalClearCola === null) {
			IntervalClearCola = setInterval(xClearCola, 7000);
		}		
	});

	arrListBorrar = arrListBorrar.slice(0, -1);
	$.ajax({
		url: './bdphp/log_003.php?op=301',
		type: 'POST',
		data: { id: arrListBorrar }
	});

	$("#div_error").addClass('xInvisible');
}

function xUpdateEstado(_id) {
	// const _id = ListDocs[_index].idprint_server_detalle;	
	$.ajax({
		url: './bdphp/log_003.php?op=3',
		type: 'POST',
		data: { id: _id}
	})
	.done( ()=> {
		const nomTd = "#td_estado" + _id;
		$(nomTd).text('Impreso');
		$(nomTd).addClass('xVerde');

		if (IntervalClearCola===null) {
			IntervalClearCola = setInterval(xClearCola, 7000);
		}
	});
}

function xUpdateEstadoError(_id) {
	// const _id = ListDocs[_index].idprint_server_detalle;	
	$.ajax({
		url: './bdphp/log_003.php?op=302',
		type: 'POST',
		data: { id: _id}
	}).done((x)=> {
		// console.log(x);
	});
}

function xClearCola() {
	if (ListDocs.length===0) {
		clearInterval(IntervalClearCola);
		IntervalClearCola=null;
		return;}	
	
	let paso=false;
	ListDocs.map((x, index) => {
		if (x.quitar_lista === 0) return;
		if (x.error === 1) return;
		if ((x.impreso === 1 || x.eliminado ) && !paso) {
			const nomTr = "#tr" + x.idprint_server_detalle;
			$(nomTr).fadeOut("slow", ()=>{
				$(this).remove();
				ListDocs.splice(index,1);
			});			
			paso=true;
		}
	})
}


function xUpdateEstructuras() {
	$.ajax({
		url: './bdphp/log_003.php?op=5',
		type: 'POST',
		data : _data_o
	})
	.done((res) => {
		const logo = res.trim();
		$.ajax({
			url: './bdphp/log_003.php?op=4',
			type: 'POST'
		})
		.done((res) => {
			const _res = $.parseJSON(res);		
			let listEstructuras = _res.datos;
	
			$.ajax({
				url: ipUrlLocal + '/restobar/print/client/comprobar_estructura.php',
				type: 'POST',
				data: { arrEstructura: listEstructuras, logo: logo}
			})
			.done((res) => {
				console.log('run estructura');
				console.log(res);
			});	
	
		});
	});
}

// function xGenerarGrafico() {
// 	const _ListEstadisticaView = groupBy(ListEstadistica, 'descripcion_doc');
// 	let _chart = [];
// 	Object.keys(_ListEstadisticaView).map((k, index) => {
// 		_chart.push([k, _ListEstadisticaView[k].length]);
// 	});

// 	// console.log(_chart);

// 	var chart = c3.generate({
// 		bindto: '#xchart',
// 		data: {			
// 			columns: _chart,
// 			type: 'bar', labels: true
// 		},
// 		bar: {
// 			width: {
// 				ratio: 0.3 // this makes bar width 50% of length between ticks
// 			}			
// 		}
// 	});

// }

function getUrlParameter(sParam,simbolo) {
	var sPageURL = window.location.href;
	sPageURL=sPageURL.replace('-',' ');
	var sURLVariables = sPageURL.split(simbolo);
	for (var i = 0; i < sURLVariables.length; i++)
		{ var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) { return sParameterName[1]; } }
}

var groupBy = function (xs, key) {
	return xs.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};