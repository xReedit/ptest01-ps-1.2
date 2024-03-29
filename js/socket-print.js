
var socketPrint;
function openSocket(data) {
	// socketPrint = io.connect('http://localhost:5819', {
	socketPrint = io.connect('https://app.restobar.papaya.com.pe', {
    	query: {
    		idorg: _data_o.o,
    		idsede: _data_o.s,
    		isFromApp: 0
    	}
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

