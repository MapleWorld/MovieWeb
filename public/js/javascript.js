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

function InsertVideoInfo(){
	AjaxCall("/insertMovie", "GET");
};

function ClearDB(){
	AjaxCall("/clear", "GET");
};