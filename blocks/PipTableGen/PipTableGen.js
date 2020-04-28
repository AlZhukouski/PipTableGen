//Генерация таблицы Полотно с ячейками

function tableGenerator(row, column) {

	let quotes = ''

	let content = '';
	let vvv = 0;
	let tableStart = '', tableEnd = '', tableRowStart = '', tableRowEnd = '', tableDataStart = '', tableDataEnd = '';

	//если нужна с ковычками таблица
	if (quotes == '-q') {
		tableStart = '"<table cellpadding="+""10""+" border="+""1""+" bordercolor="+""#afafaf""+" rules="+""all">';
		tableEnd = '</table>"';
		tableRowStart = '<tr>';
		tableRowEnd = '</tr>';
		tableDataStart = '<td align="+""center""+" valign="+""center""+" bgcolor="+""#fbfbfb""+" height="+""150""+" width="+""80">';
		tableDataEnd = '</td>';
		//без кавычек таблица
	} else {
		tableStart = '<table cellpadding="10" border="1" bordercolor="#afafaf" rules="all">';
		tableEnd = '</table>';
		tableRowStart = '<tr>';
		tableRowEnd = '</tr>';
		tableDataStart = '<td align="center" valign="center" bgcolor="#fbfbfb" height="150" width="80">';
		tableDataEnd = '</td>';
	}
	//собираем таблицу по правилам выше
	content += tableStart;
	for (let i = 0; i < row; i++) { // выведет 0, затем 1, затем 2
		content += tableRowStart;
		for (let y = 0; y < column; y++) {
			vvv++;
			content += tableDataStart;
			content += vvv;
			content += tableDataEnd;
		}
		content += tableRowEnd;
	}
	content += tableEnd;
	return content;
}

//по триггеру генерируем таблицу
function checkingValues (w1, h1, cellWidth, cellHeight) {

}

//функция построение нужной таблицы с проверками
var tableCode;
function tableResult() {
//получим значение форм для генерации таблицы
	var canvasHeight, canvasWidth, cellHeight, cellWidth;
	canvasWidth = $('#canvas-width').val();
	canvasHeight = $('#canvas-height').val();
	cellWidth = $('#cell-width').val();
	cellHeight = $('#cell-height').val();

	//проверим корректность значений
	checkingValues(canvasWidth, canvasHeight, cellWidth, cellHeight);

	//рассчитываем таблицу
	let row, col;
	row = Math.floor(+canvasWidth/+cellWidth);
	col = Math.floor(+canvasHeight/+cellHeight);

	tableCode=tableGenerator(row, col);
	$('.PipTableGen__build').empty().append(tableCode);
}

$('.trigger').on('click', tableResult);

//копируем в буфер обмена
$('.read-btn').on('click', function () {
	navigator.clipboard.writeText(tableCode).then(function() {
		console.log('Async: Copying to clipboard was successful!');
	}, function(err) {
		console.error('Async: Could not copy text: ', err);
	});
});

