$(function() {
	$.ajax({
		type : "GET",
		url : '/default/table',
		success : function(partialPage) {
			$("#video_info").html(partialPage);
		}, error : function(xhr, status, error) {
			$.growl.error({ title: "", message: xhr.responseText });
			return false;
		}
	});
});