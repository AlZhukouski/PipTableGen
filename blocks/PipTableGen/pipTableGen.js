//Генерация таблицы Полотно с ячейками

function tableGenerator(row, column, bgColor, borderColor, cellWidth, cellHeight) {

	let quotes = ''

	let content = '';	//переменная в которую сгенерируется код таблицы
	let cellContents = 0;	//переменная содержимое ячейки
	//части таблиц из которых она собирается
	let tableStart = '', tableEnd = '', tableRowStart = '', tableRowEnd = '', tableDataStart = '', tableDataEnd = '';

	//Выбираем по парраметру  какую таблицу построить
	if (quotes == '-q') {
		tableStart = '"<table cellpadding="+""10""+" border="+""1""+" bordercolor="+""#' + borderColor + '""+" rules="+""all">';
		tableEnd = '</table>"';
		tableRowStart = '<tr>';
		tableRowEnd = '</tr>';
		tableDataStart = '<td align="+""center""+" valign="+""center""+" bgcolor="+""#' + bgColor + '""+" height="+""150""+" width="+""80">';
		tableDataEnd = '</td>';
		//без кавычек таблица
	} else {
		tableStart = '<table cellpadding="10" border="1" bordercolor="#' + borderColor + '" rules="all">';
		tableEnd = '</table>';
		tableRowStart = '<tr>';
		tableRowEnd = '</tr>';
		tableDataStart = '<td align="center" valign="center" bgcolor="#' + bgColor + '" height="' + cellHeight + '" width="' + cellWidth + '">';
		tableDataEnd = '</td>';
	}
	//собираем таблицу по правилам выше
	content += tableStart;
	for (let i = 0; i < row; i++) { // выведет 0, затем 1, затем 2
		content += tableRowStart;
		for (let y = 0; y < column; y++) {
			cellContents++;
			content += tableDataStart;
			content += cellContents;
			content += tableDataEnd;
		}
		content += tableRowEnd;
	}
	content += tableEnd;
	return content;
}

//по проверка на возможность построения таблицы по парраметрам холста и ячейки
function checkingValues(w1, h1, w2, h2) {
	//Счётчик верно введенных парраметров
	let count = 0;

	//Серия условий проверки введённых парраметров и вывода сообщений если парраметр не является положительным числом
	if (isNaN(w1) === false && Math.sign(w1) == 1) {
		$('#errorCanW').empty();
		count++
	} else {
		$('#errorCanW').empty().append('Введите положительное число.');
	}

	if (isNaN(h1) === false && Math.sign(h1) == 1) {
		$('#errorCanH').empty();
		count++
	} else {
		$('#errorCanH').empty().append('Введите положительное число.');
	}

	if (isNaN(w2) === false && Math.sign(w2) == 1) {
		$('#errorCellW').empty();
		count++
	} else {
		$('#errorCellW').empty().append('Введите положительное число.');
	}

	if (isNaN(h2) === false && Math.sign(h2) == 1) {
		$('#errorCellH').empty();
		count++
	} else {
		$('#errorCellH').empty().append('Введите положительное число.');
	}
console.log(count)
	//проверим если парраметры введены верные, высота и ширина полотна больше либо равны высоте  и ширине ячейки, то таблицу можно строить
	if (+w1 >= +w2 && +h1 >= +h2 && count == 4) {
		$('.settings__error').empty();
		return true
	} else {
		if (count == 4) {
			$('.settings__error').empty().append('Холст меньше ячейки.');
			//Очистим предыдущую таблицу
			$('.pipTableGen__build-wrap').empty();
		}
	}
}

//функция построение нужной таблицы с проверками
let tableCode;

function tableResult() {
	//запустим функцию очистки данных
	dataСleaning();

//получим значение форм для генерации таблицы
	var canvasHeight, canvasWidth, cellHeight, cellWidth, bgColor, borderColor;
	canvasWidth = $('#canvas-width').val();
	canvasHeight = $('#canvas-height').val();
	cellWidth = $('#cell-width').val();
	cellHeight = $('#cell-height').val();
	bgColor = $('#cell-color').val();
	borderColor = $('#border-color').val();


	//проверим корректность значений и если все верно запустим генерацию таблицы
	if (checkingValues(canvasWidth, canvasHeight, cellWidth, cellHeight)) {
		//рассчитываем таблицу
		let row, col;
		row = Math.floor(+canvasWidth / +cellWidth);
		col = Math.floor(+canvasHeight / +cellHeight);

		//добавим данные о таблице
		$('.pipTableGen__col').empty().append(col);
		$('.pipTableGen__row').empty().append(row);
		$('.pipTableGen__amount').empty().append(row * col);
		//Сгенерируем таблицу по парраметрам
		tableCode = tableGenerator(row, col, bgColor, borderColor, cellWidth, cellHeight);
		$('.pipTableGen__build-wrap').empty().append(tableCode);
		//Контейнеру в который закинем таблицу определим минимальную ширину равную ширине полотна что бы ячейки не сжимались
		$('.pipTableGen__build-wrap').css( 'min-width', canvasWidth + 'px')
		//Активируем кнопку Скопировать
		$('.pipTableGen__copy-btn').removeAttr("disabled");
	}

}

// функция в которой хранится очистка данных перед построением таблицы
function dataСleaning() {
	//очистим от инлайн стилией контейнер таблицы
	$('.pipTableGen__build-wrap').removeAttr("style");
	// деактивируем кнопку Скопировать
	$('.pipTableGen__copy-btn').attr("disabled", true);
	//очистим значение переменной
	tableCode='';
}

//по триггеру генерируем таблицу
$('.trigger').on('click', tableResult);

//копируем в буфер обмена
$('.pipTableGen__copy-btn').on('click', function () {
	navigator.clipboard.writeText(tableCode).then(function () {
		console.log('Async: Copying to clipboard was successful!');
	}, function (err) {
		console.error('Async: Could not copy text: ', err);
	});
});

