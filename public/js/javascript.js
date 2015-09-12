function getVideoInfo(){
	$.ajax({
		type : "GET",
		url : "/scrape",
		success : function(data) {
			console.log(data);
			$("#video_title").html(data.title);
			$("#video_view_count").html(data.view_count);
			$("#video_like_count").html(data.like_count);
			$("#video_dislike_count").html(data.dislike_count);
		}, error : function(xhr, status, error) {
			console.log(xhr.responseText);
			$.growl.error({ title: "", message: xhr.responseText });
			return false;
		}
	});
};