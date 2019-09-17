
var socketPrint;
function openSocket(data) {
	socketPrint = io.connect('https://app.restobar.papaya.com.pe', {
    	query: _data_o
	});

	socketPrint.on('printerComanda', (data) => {   
		const _dataCocinada = data[0].data.filter(x => x.print).map(x => x.print);
	    _printerComanda(_dataCocinada);
	    console.log('printerComanda data', _dataCocinada);
	});

	socketPrint.on('printerOnly', (data) => {   
		var _dataCocinada = [] ;
		_dataCocinada.push(data);
	    _printerComanda(_dataCocinada);
	    console.log('printerOnly data', _dataCocinada);
	});
}

function closeSocket() {    
    socketPrint.disconnect(true);
}

