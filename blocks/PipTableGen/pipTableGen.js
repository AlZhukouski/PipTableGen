//Генерация таблицы Полотно с ячейками
function tableGenerator(row, column, bgColor, borderColor, cellsize1, cellsize2, cellContentsOption, quotes) {

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
		tableDataStart = '<td align="+""center""+" valign="+""center""+" bgcolor="+""#' + bgColor + '""+" height="+""' + cellsize2 + '""+" width="+""' + cellsize1 + '">';
		tableDataEnd = '</td>';
		//без кавычек таблица
	} else {
		tableStart = '<table cellpadding="10" border="1" bordercolor="#' + borderColor + '" rules="all">';
		tableEnd = '</table>';
		tableRowStart = '<tr>';
		tableRowEnd = '</tr>';
		tableDataStart = '<td align="center" valign="center" bgcolor="#' + bgColor + '" height="' + cellsize2 + '" width="' + cellsize1 + '">';
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
			if (cellContentsOption == 'numbering') {
				content += cellContents;
			}

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
	if (isNaN(w1) === false && Math.sign(w1) === 1) {
		$('#errorCanW').empty();
		count++
	} else {
		$('#errorCanW').empty().append('Введите положительное число.');
	}

	if (isNaN(h1) === false && Math.sign(h1) === 1) {
		$('#errorCanH').empty();
		count++
	} else {
		$('#errorCanH').empty().append('Введите положительное число.');
	}

	if (isNaN(w2) === false && Math.sign(w2) === 1) {
		$('#errorCellW').empty();
		count++
	} else {
		$('#errorCellW').empty().append('Введите положительное число.');
	}

	if (isNaN(h2) === false && Math.sign(h2) === 1) {
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
	var canvasSize2, canvasSize1, cellsize2, cellsize1, bgColor, borderColor, cellContentsOption;
	canvasSize1 = $('#canvas-size-1').val();
	canvasSize2 = $('#canvas-size-2').val();
	cellsize1 = $('#cell-size-1').val();
	cellsize2 = $('#cell-size-2').val();
	bgColor = $('#cell-color').val();
	borderColor = $('#border-color').val();
	cellContentsOption = $('#cellContentsOption').val();

	//рассчитываем ряды и колонки по правилу большое на большое, меньшее на меньшее
	// отрисовка таблицы будет зависеть какой парраметр попадет в колонку а какой в ряд, можно добавить чекбокс для поворота таблицы
	let row, col, largeCanvasSize, lowerCanvasSize, largeCellSize, lowerCellSize;

	if (+canvasSize1 > +canvasSize2) {
		if (+cellsize1 > +cellsize2) {
			row = Math.floor(+canvasSize1 / +cellsize1);
			col = Math.floor(+canvasSize2 / +cellsize2);
			largeCanvasSize = +canvasSize1;
			lowerCanvasSize = +canvasSize2;
			largeCellSize = +cellsize1;
			lowerCellSize = +cellsize2;
			console.log('1')
		} else {
			row = Math.floor(+canvasSize1 / +cellsize2);
			col = Math.floor(+canvasSize2 / +cellsize1);
			largeCanvasSize = +canvasSize1;
			lowerCanvasSize = +canvasSize2;
			largeCellSize = +cellsize2;
			lowerCellSize = +cellsize1;
			console.log('2')
		}
	} else {
		if (+cellsize1 > +cellsize2) {
			row = Math.floor(+canvasSize2 / +cellsize1);
			col = Math.floor(+canvasSize1 / +cellsize2);
			largeCanvasSize = +canvasSize2;
			lowerCanvasSize = +canvasSize1;
			largeCellSize = +cellsize1;
			lowerCellSize = +cellsize2;
			console.log('3')
		} else {
			row = Math.floor(+canvasSize2 / +cellsize1);
			col = Math.floor(+canvasSize1 / +cellsize2);
			largeCanvasSize = +canvasSize2;
			lowerCanvasSize = +canvasSize1;
			largeCellSize = +cellsize2;
			lowerCellSize = +cellsize1;
			console.log('4')
		}
	}


	//проверим корректность значений и если все верно запустим генерацию таблицы
	if (checkingValues(largeCanvasSize, lowerCanvasSize, largeCellSize, lowerCellSize)) {

		//добавим данные о таблице
		$('.pipTableGen__col').empty().append(col);
		$('.pipTableGen__row').empty().append(row);
		$('.pipTableGen__amount').empty().append(row * col);

		//Сгенерируем таблицу по парраметрам
		tableCode = tableGenerator(row, col, bgColor, borderColor, largeCellSize, lowerCellSize, cellContentsOption, false);
		$('.pipTableGen__build-wrap').empty().append(tableCode);

		//Контейнеру в который закинем таблицу определим минимальную ширину равную ширине полотна что бы ячейки не сжимались
		$('.pipTableGen__build-wrap').css('min-width', col * +largeCellSize + 'px').css('min-height', row * +lowerCellSize + 'px')
		//Активируем кнопку Скопировать
		$('.pipTableGen__copy-btn').removeAttr("disabled");

		//Генерация для планфикса диапазона таблиц
		planfixTablesGen(row, col, largeCellSize, lowerCellSize, largeCanvasSize, lowerCanvasSize, bgColor, borderColor, cellContentsOption, true);

	}

}

// функция в которой хранится очистка данных перед построением таблицы
function dataСleaning() {
	//очистим от инлайн стилией контейнер таблицы
	$('.pipTableGen__build-wrap').removeAttr("style");
	// деактивируем кнопку Скопировать
	$('.pipTableGen__copy-btn').attr("disabled", true);
	//очистим значение переменной
	tableCode = '';
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

function planfixTablesGen(row, col, largeCellSize, lowerCellSize, largeCanvasSize, lowerCanvasSize, bgColor, borderColor, cellContentsOption, quotes) {
	//W-ширина,H-высота
	//1-ячейка
	//2-холст

	// Формула из планфикса
	// если(И(W1>=H1;W2>=H2);
	// если(И(ОКРУГЛВНИЗ((W2/W1);0)=1;ОКРУГЛВНИЗ((H2/H1);0)=1);"ТАБЛИЦА1х1";
	// "Лист меньше бумаги1");
	console.log('row= ' + row + ' col= ' + col + ' largeCellSize= ' + largeCellSize + ' lowerCellSize= ' + lowerCellSize + ' largeCanvasSize= ' + largeCanvasSize + ' lowerCanvasSize= ' + lowerCanvasSize);

	let planfixFormula1 = 'если(И({{Задача.W1}}>={{Задача.H1}};{{Задача.W2}}>={{Задача.H2}});',
			planfixFormula2 = 'если(И({{Задача.W1}}>={{Задача.H1}};{{Задача.H2}}>={{Задача.W2}});',
			planfixFormula3 = 'если(И({{Задача.H1}}>={{Задача.W1}};{{Задача.W2}}>={{Задача.H2}});',
			planfixFormula4= 'если(И({{Задача.H1}}>={{Задача.W1}};{{Задача.H2}}>={{Задача.W2}});',
			planfixFormulaElse = '"Лист меньше бумаги1");',
			planfixFormula='"Конец всех исходов")))))';


	for (let i = 1; i <= row; i++) {
		console.log('Цикл рядов' + ' i= ' + i);

		for (let y = 1; y <= col; y++) {
			//console.log('Внутренний цикл колонок' + ' y= ' + y + ' i= ' + i);
			planfixFormula1+='если(И(ОКРУГЛВНИЗ(({{Задача.W2}}/{{Задача.W1}});0)=' + y + ';ОКРУГЛВНИЗ(({{Задача.H2}}/{{Задача.H1}});0)=' + i + ');';
			planfixFormula1+=tableGenerator(i, y, bgColor, borderColor, largeCellSize, lowerCellSize, cellContentsOption, quotes);
			planfixFormula1+=';';
		}
		console.log('');
	}
	console.log("planfixFormula1");
	console.log(planfixFormula1);
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
	download.id = "download";
	document.body.appendChild(download);
	document.getElementById("download").click();
	document.body.removeChild(download);
}

//writeFile("9dksk239xwd.txt", "jxowsjsivneic");

