function InsertVideoInfo(){
	$.ajax({
		type : "GET",
		url : "/insertMovie",
		success : function(data) {
			console.log(data);
		}, error : function(xhr, status, error) {
			console.log(xhr.responseText);
			$.growl.error({ title: "", message: xhr.responseText });
			return false;
		}
	});
};