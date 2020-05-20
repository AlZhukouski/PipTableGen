//Генерация таблицы Полотно с ячейками
function tableGenerator(row, column, bgColor, borderColor, cellsize1, cellsize2, cellContentsOption, quotes) {

	let content = '';	//переменная в которую сгенерируется код таблицы
	let cellContents = 0;	//переменная содержимое ячейки
	//части таблиц из которых она собирается
	let tableStart = '', tableEnd = '', tableRowStart = '', tableRowEnd = '', tableDataStart = '', tableDataEnd = '';

	//Выбираем по парраметру  какую таблицу построить, с кавычками по синтаксису планфикса или html
	//"<table cellpadding="+""10""+" border="+""1""+" bordercolor="+""#afafaf""+" rules="+""all""+">
	// <tr>
	// <td align="+""center""+" valign="+""center""+" bgcolor="+""#fbfbfb""+" height="+""75""+" width="+""40""+">1</td>
	// </tr>
	// </table>"
	if (quotes) {
		tableStart = '"<table cellpadding="+""10""+" border="+""1""+" bordercolor="+""#' + borderColor + '""+" rules="+""all""+">';
		tableEnd = '</table>"';
		tableRowStart = '<tr>';
		tableRowEnd = '</tr>';
		tableDataStart = '<td align="+""center""+" valign="+""center""+" bgcolor="+""#' + bgColor + '""+" height="+""' + cellsize2 + '""+" width="+""' + cellsize1 + '""+">';
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

//Переменные хранения результата функций
let tableCode, planfixformula;

//функция построение нужной таблицы с проверками
function tableResult() {
	//запустим функцию очистки данных
	dataСleaning();

//получим значение форм для генерации таблицы
	var canvasSize2, canvasSize1, cellsize2, cellsize1, bgColor, borderColor, cellContentsOption, W1, H1, W2, H2,
		message1, message2;
	canvasSize1 = $('#canvas-size-1').val();
	canvasSize2 = $('#canvas-size-2').val();
	cellsize1 = $('#cell-size-1').val();
	cellsize2 = $('#cell-size-2').val();
	bgColor = $('#cell-color').val();
	borderColor = $('#border-color').val();
	cellContentsOption = $('#cellContentsOption').val();
	W1 = $('#canvas-name-1').val();
	H1 = $('#canvas-name-2').val();
	W2 = $('#cell-name-1').val();
	H2 = $('#cell-name-2').val();
	message1 = $('#message1').val();
	message2 = $('#message2').val();

	//рассчитываем ряды и колонки по правилу большое на большое, меньшее на меньшее
	// отрисовка таблицы будет зависеть какой парраметр попадет в колонку а какой в ряд, можно добавить чекбокс для поворота таблицы
	let row, col, cellWidth, cellHeight;

	if (+canvasSize1 > +canvasSize2) {
		if (+cellsize1 > +cellsize2) {
			col = Math.floor(+canvasSize1 / +cellsize1);
			row = Math.floor(+canvasSize2 / +cellsize2);
			cellWidth = +cellsize1;
			cellHeight = +cellsize2;
		} else {
			col = Math.floor(+canvasSize1 / +cellsize2);
			row = Math.floor(+canvasSize2 / +cellsize1);
			cellWidth = +cellsize2;
			cellHeight = +cellsize1;
		}
	} else {
		if (+cellsize1 > +cellsize2) {
			col = Math.floor(+canvasSize1 / +cellsize2);
			row = Math.floor(+canvasSize2 / +cellsize1);
			cellWidth = +cellsize2;
			cellHeight = +cellsize1;
		} else {
			col = Math.floor(+canvasSize1 / +cellsize1);
			row = Math.floor(+canvasSize2 / +cellsize2);
			cellWidth = +cellsize1;
			cellHeight = +cellsize2;
		}
	}


	//проверим корректность значений и если все верно запустим генерацию таблицы
	if (checkingValues(canvasSize1, canvasSize2, cellsize1, cellsize2)) {

		//добавим данные о таблице
		$('.pipTableGen__col').empty().append(col);
		$('.pipTableGen__row').empty().append(row);
		$('.pipTableGen__amount').empty().append(row * col);

		//Сгенерируем таблицу по парраметрам
		tableCode = tableGenerator(row, col, bgColor, borderColor, cellWidth, cellHeight, cellContentsOption, false);
		$('.pipTableGen__build-wrap').empty().append(tableCode);

		//Контейнеру в который закинем таблицу определим минимальную ширину равную ширине полотна что бы ячейки не сжимались
		$('.pipTableGen__build-wrap').css('min-width', row * +cellWidth + 'px').css('min-height', col * +cellHeight + 'px')
		//Активируем кнопку Скопировать
		$('.pipTableGen__copy-btn').removeAttr("disabled");

		//Генерация для планфикса диапазона таблиц
		planfixformula = planfixTablesGen(row, col, bgColor, borderColor, cellWidth, cellHeight, cellContentsOption, true, W1, H1, W2, H2, message1, message2);
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
	planfixformula = '';
}

//построим генерацию таблицы для планфикса с учетом всей конструкции и цикла

function planfixTablesGen(row, col, bgColor, borderColor, cellWidth, cellHeight, cellContentsOption, quotes, W1, H1, W2, H2, message1, message2) {
	//W-ширина,H-высота
	//1-ячейка
	//2-холст

	let planfixFormula1 = 'если(И(' + W2 + '>=' + H2 + ';' + W1 + '>=' + H1 + ');',
		planfixFormula2 = 'если(И(' + W2 + '>=' + H2 + ';' + H1 + '>=' + W1 + ');',
		planfixFormula3 = 'если(И(' + H2 + '>=' + W2 + ';' + W1 + '>=' + H1 + ');',
		planfixFormula4 = 'если(И(' + H2 + '>=' + W2 + ';' + H1 + '>=' + W1 + ');',
		planfixFormulaElse = '"' + message1 + '"',
		planfixFormulaEnd = '"' + message2 + '"))))',
		result = '',
		table1 = '',
		table2 = '';

	for (let i = 1; i <= row; i++) {
		for (let y = 1; y <= col; y++) {
			//сформируем количество закрывающихся скобок
			planfixFormulaElse += ')';

			//сохраним сюда вычеслиние таблицы
			table1 = tableGenerator(i, y, bgColor, borderColor, cellWidth, cellHeight, cellContentsOption, quotes);
			table2 = tableGenerator(y, i, bgColor, borderColor, cellWidth, cellHeight, cellContentsOption, quotes);

			// Формула из планфикса
			// если(И(W1>=H1;W2>=H2);
			// если(И(ОКРУГЛВНИЗ((W2/W1);0)=1;ОКРУГЛВНИЗ((H2/H1);0)=1);"ТАБЛИЦА1х1";
			// "Лист меньше бумаги1");
			planfixFormula1 += 'если(И(ОКРУГЛВНИЗ((' + W1 + '/' + W2 + ');0)=' + y + ';ОКРУГЛВНИЗ((' + H1 + '/' + H2 + ');0)=' + i + ');';
			planfixFormula1 += table1;
			planfixFormula1 += ';';

			//если(И(W1>=H1;H2>=W2);
			//если(И(ОКРУГЛВНИЗ((H2/W1);0)=1;ОКРУГЛВНИЗ((W2/H1);0)=1);"ТАБЛИЦА1х1";
			//"Лист меньше бумаги1");
			planfixFormula2 += 'если(И(ОКРУГЛВНИЗ((' + H1 + '/' + W2 + ');0)=' + y + ';ОКРУГЛВНИЗ((' + W1 + '/' + H2 + ');0)=' + i + ');';
			planfixFormula2 += table2;
			planfixFormula2 += ';';

			//если(И(H1>=W1;W2>=H2);
			//если(И(ОКРУГЛВНИЗ((W2/H1);0)=1;ОКРУГЛВНИЗ((H2/W1);0)=1);"ТАБЛИЦА1х1";
			//"Лист меньше бумаги1");
			planfixFormula3 += 'если(И(ОКРУГЛВНИЗ((' + W1 + '/' + H2 + ');0)=' + y + ';ОКРУГЛВНИЗ((' + H2 + '/' + W1 + ');0)=' + i + ');';
			planfixFormula3 += table1;
			planfixFormula3 += ';';

			//если(И(H1>=W1;H2>=W2);
			//если(И(ОКРУГЛВНИЗ((H2/H1);0)=1;ОКРУГЛВНИЗ((W2/W1);0)=1);"ТАБЛИЦА1х1";
			//"Лист меньше бумаги1");
			planfixFormula4 += 'если(И(ОКРУГЛВНИЗ((' + H1 + '/' + H2 + ');0)=' + y + ';ОКРУГЛВНИЗ((' + W1 + '/' + W2 + ');0)=' + i + ');';
			planfixFormula4 += table2;
			planfixFormula4 += ';';
		}
	}
	planfixFormulaElse += ';';

	result = planfixFormula1 + planfixFormulaElse + planfixFormula2 + planfixFormulaElse + planfixFormula3 + planfixFormulaElse + planfixFormula4 + planfixFormulaElse + planfixFormulaEnd;

	return result;
}

//по триггеру генерируем таблицу
$('.pipTableGen__gen-btn').on('click', tableResult);

//копируем в буфер обмена
$('.pipTableGen__copy-btn').on('click', function () {
	navigator.clipboard.writeText(planfixformula).then(function () {
		console.log('Async: Copying to clipboard was successful!');
	}, function (err) {
		console.error('Async: Could not copy text: ', err);
	});
});


//пока не работает
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

//по триггеру загрузим файл с планфикс формулой
$('.pipTableGen__download-btn').on('click', function () {
	writeFile("123.txt", planfixformula)
});



