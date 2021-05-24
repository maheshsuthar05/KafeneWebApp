$(function(){
    var loginStatus = localStorage.getItem("isUserLoggedIn");
    if(loginStatus == 1){
        window.location.assign("orders.html");
    }
    else{
        var loginForm = $("#login-form");
        loginForm.submit(function(e){
        e.preventDefault();
        var username = $("input[type=text]");
        var password = $(".pwd");
        if(username.val() === password.val()){
            alert("Login Successful!");
            window.location.assign("orders.html");
            localStorage.setItem("isUserLoggedIn",1);
        }
        else{
            alert("Please enter valid credentials");
        }
    })
    }
    
})