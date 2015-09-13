function AjaxCall(url, type){
	$.ajax({
		type : type,
		url : url,
		success : function(data) {
			$.growl.notice({ title: "", message: data });
		}, error : function(xhr, status, error) {
			console.log(xhr.responseText);
			$.growl.error({ title: "", message: xhr.responseText });
			return false;
		}
	});
};

function AjaxCallSearch(url, type){
	$.ajax({
		type : type,
		url : url,
		success : function(data) {
			$("#video_info").html(data);
		}, error : function(xhr, status, error) {
			console.log(xhr.responseText);
			$.growl.error({ title: "", message: xhr.responseText });
			return false;
		}
	});
};

function InsertVideoInfo(){
	AjaxCall("/insertMovie", "GET");
};

function ClearDB(){
	AjaxCall("/clear", "GET");
};

function ListAllMovies(){
	AjaxCallSearch("/all/movies", "GET");
};

function SearchByDate(date){
	AjaxCallSearch("/search/date/" + date, "GET");
};
