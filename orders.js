$(function(){
    var loginStatus = localStorage.getItem("isUserLoggedIn");
    if(loginStatus == 1){
        $(".logout-btn").click(function(){
            localStorage.setItem("isUserLoggedIn",0);
            window.location.assign("index.html");
        })
        $(".nav-menu-item").removeClass("active");
        $(".orders").addClass("active");
        $.ajax({
            type:"GET",
            url:"https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/orders",
            success:function(response){
                showOrders(response);
            }
        })
    }
    else{
        window.location.assign("index.html");
    }

    function showOrders(ordersList){
        var bodySection = $("#body-section");
        
        var mainSection = $("<section>").attr("id","main-section");
        bodySection.append(mainSection);
        
        mainSection.append($("<h1>").text("Orders"));

        var orderSection = $("<section>").attr("id","order-section");
        mainSection.append(orderSection);

        var filterSection =$("<nav>").attr("id","filter-section").css("width","15%");
        orderSection.append(filterSection);

        filterSection.append($("<h3>").text("Filters").css("margin-top","0"));
        filterSection.append($("<span>").text("Count: "));
        filterSection.append($("<span>").addClass("counter").text(ordersList.length));

        var filterMenu = $("<div>").addClass("filter-menu");
        filterSection.append(filterMenu);

        //Creating the 4 checkboxes for filter Menu

        filterMenu.html(`<label class="checkbox-container">
                            <input type="checkbox" name="order-status" class="checkbox" value="new">
                            <span>New</span>
                         </label>
                         <label class="checkbox-container">
                            <input type="checkbox" name="order-status" class="checkbox" value="packed">
                            <span>Packed</span>
                         </label>
                         <label class="checkbox-container">
                            <input type="checkbox" name="order-status" class="checkbox" value="intransit">
                            <span>InTransit</span>
                         </label>
                         <label class="checkbox-container">
                            <input type="checkbox" name="order-status" class="checkbox" value="delivered">
                            <span>Delivered</span>
                         </label>`);

        renderOrderList(ordersList);
        //Creating the Orders table
        
        function renderOrderList(orders){
            var showOrders = $("<section>").attr("id","show-orders");
            orderSection.append(showOrders);

            var orderTable = $("<table>").attr("id","order-table").css("width","100%");
            showOrders.append(orderTable);

            //Order Table Heading
            var orderTableHeading = $("<tr>");
            orderTable.append(orderTableHeading);

            orderTableHeading.html(`<th class="table-heading"> ID </th>
                                    <th class="table-heading"> Customer </th>
                                    <th class="table-heading"> Date </th>
                                    <th class="table-heading"> Amount </th>
                                    <th class="table-heading"> Status </th>`);

            //Order Table Body
            var tBody = $("<tbody>").attr("id","table-body");
            orderTable.append(tBody);

            for(var i=0; i<orders.length; i++){
                var tRow = `<tr class="table-row">
                                <td class="tdColor2">${orders[i].id}</td>
                                <td class="tdColor1">${orders[i].customerName}</td>
                                <td class="tdColor1">${orders[i].orderDate}<br> <span class="tdColor2"> ${orders[i].orderTime} </span> </td>
                                <td class="tdColor2">${orders[i].amount}</td>
                                <td class="tdColor2 order-status">${orders[i].orderStatus}</td>
                            </tr>`
                tBody.append(tRow);
            }

             //Checking what user have checked
            $(".checkbox").change(function(){
                var checkedInput = [];
                $(".filter-menu :input:checked").each(function(){
                    checkedInput.push($(this).val().toLowerCase())       // push values to an array which are checked
                }) 
                $(".table-row").hide();                                 // Initially hiding all rows
                var oStatus = $(".order-status").filter(function () {   //filter function
                    var status = $(this).text().toLowerCase();          //ready status of all orders 
                    var index = $.inArray(status, checkedInput);        //checking status of all orders with value of checked boxes
                    return index >= 0                                   //If present true condition returned
                }).parent().show();                                     //And that particular row is shown
                //$(".counter").text($(".table-row :visible").length);    
                var numOfVisibleRows = $('tr').filter(function() {
                    return $(this).css('display') !== 'none';
                  }).length;
                $(".counter").text(numOfVisibleRows-1);       
            })
        }
    }
})