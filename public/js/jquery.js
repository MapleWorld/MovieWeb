$(function() {
	$.get('/default/table',
		function(partialPage) {
			$("#video_info").html(partialPage);
		}
	);
});