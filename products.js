$(function(){
    var loginStatus = localStorage.getItem("isUserLoggedIn");
    if(loginStatus == 1){
        $(".logout-btn").click(function(){
            localStorage.setItem("isUserLoggedIn",0);
            window.location.assign("index.html");
        })
        $(".nav-menu-item").removeClass("active");
        $(".products").addClass("active");
        $.ajax({
            type:"GET",
            url:"https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/products",
            success:function(response){
                showProducts(response);
            }
        })
    }
    else{
        window.location.assign("index.html");
    }

    function showProducts(productsList){

        productsList = calculateExpiry(productsList);
        
        var bodySection = $("#body-section");
        
        var mainSection = $("<section>").attr("id","main-section");
        bodySection.append(mainSection);
        
        mainSection.append($("<h1>").text("Products"));

        var productSection = $("<section>").attr("id","product-section");
        mainSection.append(productSection);

        var filterSection =$("<nav>").attr("id","filter-section").css("width","15%");
        productSection.append(filterSection);

        filterSection.append($("<h3>").text("Filters").css("margin-top","0"));
        filterSection.append($("<span>").text("Count: "));
        filterSection.append($("<span>").addClass("counter").text(productsList.length));

        var filterMenu = $("<div>").addClass("filter-menu");
        filterSection.append(filterMenu);

        filterMenu.html(`<label class="checkbox-container">
                            <input type="checkbox" name="order-status" class="checkbox expired" value="expired">
                            <span>Expired</span>
                         </label>
                         <label class="checkbox-container">
                            <input type="checkbox" name="order-status" class="checkbox lowstock" value="lowstock">
                            <span>Low Stock</span>
                         </label>`);
                  
        renderProductList(productsList);    //Creating the Products table
        
        function renderProductList(products){
            var showProducts = $("<section>").attr("id","show-products");
            productSection.append(showProducts);

            var productTable = $("<table>").attr("id","product-table").css("width","100%");
            showProducts.append(productTable);

            //Product Table Heading
            var productTableHeading = $("<tr>");
            productTable.append(productTableHeading);

            productTableHeading.html(`<th class="table-heading">ID</th>
                                    <th class="table-heading">Product Name</th>
                                    <th class="table-heading">Product Brand</th>
                                    <th class="table-heading">Expiry Date</th>
                                    <th class="table-heading">Unit Price</th>
                                    <th class="table-heading">Stock</th>`);
            //Product Table Body
            var tBody = $("<tbody>").attr("id","table-body");
            productTable.append(tBody);

            for(var i=0; i<products.length; i++){
                var sDate = products[i].expiryDate.split("-");
                products[i].expiryDate = sDate[0]+" "+sDate[1]+", "+sDate[2];
            }
            for(var i=0; i<products.length; i++){
                var tRow = `<tr class="table-row">
                                <td class="tdColor2">${products[i].id}</td>
                                <td class="tdColor1">${products[i].medicineName}</td>
                                <td class="tdColor2">${products[i].medicineBrand}</td>
                                <td class="tdColor1">${products[i].expiryDate}</td>
                                <td class="tdColor2">${products[i].unitPrice}</td>
                                <td class="tdColor2 stock">${products[i].stock}</td>
                                <td class="tdColor1 expiry" style="visibility:hidden">${products[i].isExpired}</td>
                            </tr>`
                tBody.append(tRow);
            }

            //Filtering expired 
             $(".expired").change(function(){
                $(".table-row").hide();   
                var exp = $(".expiry").filter(function () {   
                    var ex = $(this).text();     
                    return ex === 'true';                            
                }).parent().show();
                   
                var numOfVisibleRows = $('tr').filter(function() {
                    return $(this).css('display') !== 'none';
                  }).length;
                $(".counter").text(numOfVisibleRows-1);       
            })

            //Filtering low stock 
            $(".lowstock").change(function(){
                $(".table-row").hide();   
                var stocks = $(".stock").filter(function () {   
                    var ls = $(this).text();     
                    return ls > 100;                            
                }).parent().show();
                   
                var numOfVisibleRows = $('tr').filter(function() {
                    return $(this).css('display') !== 'none';
                  }).length;
                $(".counter").text(numOfVisibleRows-1);       
            })
        }

        function calculateExpiry(productList){

            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            //calculating and adding expiry dates to product list object
            for(var i=0; i<productList.length; i++){
                var expiryDate = productList[i].expiryDate.split("-");
                var currDate = new Date();
                for(var j=0;j<months.length;j++){
                    if(expiryDate[1] === months[j]){
                        expiryDate[1]=j+1;
                    }                      
                }
                if(expiryDate[1]<10){
                    expiryDate[1]='0'+expiryDate[1];
                } 
                expiryDate = new Date(expiryDate[2]+"-"+expiryDate[1]+"-"+expiryDate[0]);
                var diff = new Date(currDate - expiryDate);
                var days  = diff/1000/60/60/24;  
                if(days<=0){
                    productList[i].isExpired = false;
                }
                else{
                    productList[i].isExpired = true;
                }
            }

            return productList;
        }
    }
})