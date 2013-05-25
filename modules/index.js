$(function(){
	$('#login_btn').click(function(){
		$.post('/login',{email:$('#email').val(),password:$('#password').val()},function(data){
			if(data.success==true) {
				window.location = data.url;
			} else {
				$('#alert_message').html(data.message);
				$('#alerts').show();
			}
		})
	});
});