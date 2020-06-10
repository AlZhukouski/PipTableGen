document.addEventListener('DOMContentLoaded', function () {
	// тут активируем урезанную версию скрипта для тети в планфиксе

	$('.pipTableGen__gen-btn-1').on('click', tableResult1);

// для тети в планфиксе урезанная версия
	$("body.planfix").keypress(function (e) {
		if (e.which == 13) {
			tableResult1 ();
		}
	});
//для индекс страницы
	$("body.page").keypress(function (e) {
		if (e.which == 13) {
			tableResult ();
		}
	});

//функция построение нужной таблицы с проверками
	function tableResult1() {
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

		if (+canvasSize1 >= +canvasSize2) {
			if (+cellsize1 >= +cellsize2) {
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
			if (+cellsize1 >= +cellsize2) {
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
			$('.pipTableGen__build-wrap').css('min-width', col * +cellWidth + 'px').css('min-height', row * +cellHeight + 'px')
			//Активируем кнопку Скопировать
		}

	}
});
