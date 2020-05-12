//Генерация таблицы Полотно с ячейками
function tableGenerator(row, column, bgColor, borderColor, cellWidth, cellHeight, cellContentsOption, quotes) {

	let content = '';	//переменная в которую сгенерируется код таблицы
	let cellContents = 0;	//переменная содержимое ячейки
	//части таблиц из которых она собирается
	let tableStart = '', tableEnd = '', tableRowStart = '', tableRowEnd = '', tableDataStart = '', tableDataEnd = '';

	//Выбираем по парраметру  какую таблицу построить, с кавычками по синтаксису планфикса или html
	if (quotes) {
		tableStart = '"<table cellpadding="+""10""+" border="+""1""+" bordercolor="+""#' + borderColor + '""+" rules="+""all">';
		tableEnd = '</table>"';
		tableRowStart = '<tr>';
		tableRowEnd = '</tr>';
		tableDataStart = '<td align="+""center""+" valign="+""center""+" bgcolor="+""#' + bgColor + '""+" height="+""' + cellHeight + '""+" width="+""' + cellWidth + '">';
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
			//если стоит опция нумерация ячеек то добавим ее в ячейки
			if (cellContentsOption == 'numbering') {content += cellContents;}

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
	var canvasHeight, canvasWidth, cellHeight, cellWidth, bgColor, borderColor, cellContentsOption;
	canvasWidth = $('#canvas-width').val();
	canvasHeight = $('#canvas-height').val();
	cellWidth = $('#cell-width').val();
	cellHeight = $('#cell-height').val();
	bgColor = $('#cell-color').val();
	borderColor = $('#border-color').val();
	cellContentsOption = $('#cellContentsOption').val();


	//проверим корректность значений и если все верно запустим генерацию таблицы
	if (checkingValues(canvasWidth, canvasHeight, cellWidth, cellHeight)) {
		//рассчитываем таблицу
		let row, col;
		row = Math.floor(+canvasHeight / +cellHeight);
		col = Math.floor(+canvasWidth / +cellWidth);

		//добавим данные о таблице
		$('.pipTableGen__col').empty().append(col);
		$('.pipTableGen__row').empty().append(row);
		$('.pipTableGen__amount').empty().append(row * col);
		//Сгенерируем таблицу по парраметрам
		tableCode = tableGenerator(row, col, bgColor, borderColor, cellWidth, cellHeight, cellContentsOption, false);
		$('.pipTableGen__build-wrap').empty().append(tableCode);
		//Контейнеру в который закинем таблицу определим минимальную ширину равную ширине полотна что бы ячейки не сжимались
		$('.pipTableGen__build-wrap').css( 'min-width', col*+cellWidth + 'px').css( 'min-height', row*+cellHeight + 'px')
		//Активируем кнопку Скопировать
		$('.pipTableGen__copy-btn').removeAttr("disabled");

		//Генерация для планфикса диапазона таблиц
		planfixTablesGen(cellWidth,cellHeight,canvasWidth,canvasHeight);

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

//построим генерацию таблицы для планфикса с учетом всей конструкции и цикла

function planfixTablesGen(W1,H1,W2,H2) {
	//W-ширина,H-высота
	//1-ячейка
	//2-холст

	// Формула из планфикса
	// если(И(W1>=H1;W2>=H2);
	// если(И(ОКРУГЛВНИЗ((W2/W1);0)=1;ОКРУГЛВНИЗ((H2/H1);0)=1);"ТАБЛИЦА1х1";
	// "Лист меньше бумаги1");




	console.log('W1= ' + W1 + ' ' +' H1= ' + H1 + ' ' +' W2= ' +W2 + ' ' +' H2= ' +H2 )

	let planfixFormula='';

	// Сравним парраметры ячейки и холста и про принципу делим большее на большее, меньшее на меньшее , тоесть большую сторону хослта на большую сторону ячейки
	if (+W1>=+H1 && +W2>=+H2) {
		console.log('true - 1');
		//


		for (let i=0; i!=Math.floor(+W2 / +W1); i++) {
				console.log('Цикл колонок' + ' i= ' + i);

			for (let y=0; y!=Math.floor(+H2 / +H1); y++) {
				console.log('Внутренний цикл рядов' + ' y= ' + y + ' i= ' + i);


			}
		}
	} else {console.log('false - 1')}

}

// функция скачивания файла
function writeFile(name, value) {
	var val = value;
	if (value === undefined) {
		val = "";
	}
	var download = document.createElement("a");
	download.href = "data:text/plain;content-disposition=attachment;filename=file," + val;
	download.download = name;
	download.style.display = "none";
	download.id = "download"; document.body.appendChild(download);
	document.getElementById("download").click();
	document.body.removeChild(download);
}

//writeFile("9dksk239xwd.txt", "jxowsjsivneic");

