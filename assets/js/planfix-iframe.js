document.addEventListener('DOMContentLoaded', function () {

	var params = window.location.search.replace('?','').split('&').reduce(
			function(p,e){
				var a = e.split('=');
				p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
				return p;
			},
			{}
		);
	console.log(params);
	$('#canvas-size-1').val(params.canvasW);
	$('#canvas-size-2').val(params.canvasH);
	$('#cell-size-1').val(params.cellW);
	$('#cell-size-2').val(params.cellH);
});
