$(function(){
    var loginStatus = localStorage.getItem("isUserLoggedIn");
    if(loginStatus == 1){
        $(".logout-btn").click(function(){
            localStorage.setItem("isUserLoggedIn",0);
            window.location.assign("index.html");
        })
        $(".nav-menu-item").removeClass("active");
        $(".users").addClass("active");
        $.ajax({
            type:"GET",
            url:"https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/users",
            success:function(response){
                showUsers(response);
            }
        })
    }
    else{
        window.location.assign("index.html");
    }

    /// Main function 
    function showUsers(userList){
        
        var bodySection = $("#body-section");
        
        var mainSection = $("<section>").attr("id","main-section");
        bodySection.append(mainSection);
        
        mainSection.append($("<h1>").text("Users"));

        //Creating Search Form
        var searchForm = $("<form>").attr("id","search-form").css("display","flex");
        mainSection.append(searchForm);
        var searchInput = $("<input>").attr({"type":"search","class":"search-input","placeholder":"Search by Name"});
        searchForm.append(searchInput);
        var resetBtn = $("<input>").attr({"type":"reset","name":"reset","value":"Reset","class":"reset-btn"});
        searchForm.append(resetBtn);

        //Creating the Products table
        renderUserList(userList);    
        
        function renderUserList(users){
            var showUsers = $("<section>").attr("id","show-users");
            mainSection.append(showUsers);

            var userTable = $("<table>").attr("id","user-table").css("width","100%");
            showUsers.append(userTable);

            //Product Table Heading
            var userTableHeading = $("<tr>");
            userTable.append(userTableHeading);

            userTableHeading.html(`<th class="table-heading">ID</th>
                                    <th class="table-heading">User Avatar</th>
                                    <th class="table-heading">Full Name</th>
                                    <th class="table-heading">DoB</th>
                                    <th class="table-heading">Gender</th>
                                    <th class="table-heading">Current Location</th>`);

            //Product Table Body
            var tBody = $("<tbody>").attr("id","table-body");
            userTable.append(tBody);
            
            for(var i=0; i<users.length; i++){
                var sDate = users[i].dob.split("-");
                users[i].dob = sDate[0]+" "+sDate[1]+", "+sDate[2];
            }
            for(var i=0; i<users.length; i++){
                var tRow = `<tr class="table-row">
                                <td class="tdColor2">${users[i].id}</td>
                                <td class="tdColor1"><img src=${users[i].profilePic}></td>
                                <td class="tdColor2 fullname">${users[i].fullName}</td>
                                <td class="tdColor1">${users[i].dob}</td>
                                <td class="tdColor2">${users[i].gender}</td>
                                <td class="tdColor2">${users[i].currentCity}, ${users[i].currentCountry}</td>
                            </tr>`
                tBody.append(tRow);
            }
        }

        //Preventing form submit default
        searchForm.submit(function(e){
            e.preventDefault();
        })

        //Checking the user input text with names
        searchInput.keyup(function(e){
            if(e.key === 'Enter'){                  //Only execute if pressed enter key
                var enteredChar = $(this).val().toLowerCase();
                if(enteredChar.length < 2){            
                    alert("Please enter atleast 2 characters")
                }
                else{
                    $(".table-row").hide();                        //hide all rows
                    var data = $(".fullname").filter(function(){   //filter function
                        var names = $(this).text().toLowerCase();  //read all name from the list
                        return names.includes(enteredChar);        //check if search character matches with the name or not
                    }).parent().show();                            //show only those rows that matches
                }
            }
        })
        resetBtn.click(function(){
            $(".table-row").show();      //show all rows if user clicks reset button
        })
    }

})