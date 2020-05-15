"use strict";

$(document).ready(function () {
	// Дополнительный класс для корневого элемента, если браузер - IE или Edge
	if (/MSIE 9/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
		document.documentElement.className += ' old-browser';
	} else if (/Edge\/\d./i.test(navigator.userAgent)) {
		document.documentElement.className += ' edge-browser';
	}

	//активация найс селекта
	$(document).ready(function() {
		$('select').niceSelect();
	});
});
