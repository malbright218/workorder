$(document).ready(function () {
    $.get("/api/user", display)

    
    var data = []

    function display(data) {
        for (var i = 0; i < data.length; i++) {
            var actives = []
            var count = 0;        
            for (var j = 0; j < data[i].WorkOrders.length; j++) {
                var count = 0;
                actives.push(data[i].WorkOrders[j].status)
                var search = 'active'
                var count = actives.reduce(function(n, val) {
                    return n + (val === search);
                },0) 
            }
            // POPULATE USER TABLE
            var blankrow = $("<tr>")
            var td1 = $("<td>")
            var td2 = $("<td>")
            var td3 = $("<td>")

            td1.append(data[i].name)
            td2.append(data[i].shift)
            td3.append(count)

            blankrow.append(td1, td2, td3)
            $("#userTarget").append(blankrow)  
            //END////////////////////////////////
            /////////////////////////////////////
            // POPULATE WORK ORDER USER SELECTOR
            var option = $("<option>")
            option.attr("id", data[i].id)
            option.attr("name", data[i].name)
            option.append(data[i].name)
            $("#userList").append(option)
            //END/////////////////////////////////
            /////////////////////////////////////
        }
    }

    $("#addNewUser").on("click", generateUser)
    $("#addWorkOrder").on("click", generateWorkOrder)

    function generateUser() {
        var newName = $("#newUserName").val().trim()
        var newShift = $("#newUserShift option:selected").val().trim()
        var newUser = {}
        newUser.name = newName
        newUser.shift = newShift
        addUser(newUser)
        $("#newUserName").val('')        
    }

    function generateWorkOrder() {
        
        var body = $("#workOrderText").val().trim()
        var userNo = $("#userList option:selected").attr("id")
        var dateDue = $("#newDueDate").val().trim()
        var p = $("#orderPriority option:selected").val().trim()
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = d.getFullYear() + '-' +
            (month < 10 ? '0' : '') + month + '-' +
            (day < 10 ? '0' : '') + day;

        var newOrder = {}
        newOrder.priority = p
        newOrder.task = body
        newOrder.status = "active"
        newOrder.issued = output
        newOrder.due = dateDue
        newOrder.UserId = userNo

        if (body == '') {
            return;
        } else {
            addOrder(newOrder)
        }        
    }

    function addUser(data) {
        $.post("/api/user", data)
        location.reload();
    }

    function addOrder(data) {
        $.post("/api/orders", data)
        location.reload();
    }

    $("#allOrders").on("click", function() {
        window.location.href = "all.html"
    })


    $.get("/api/orders", go)
    

    function go(info) {
        $.get("/api/user", x)
        var xArr = []
        function x(data) {
            for (var i = 0; i < data.length; i++) {
                xArr.push(data[i].name)
            }
        }

        for (var i = 0; i < info.length; i++) {
            var inner = []
            inner.push(info[i].id)
            inner.push(info[i].UserId)
            inner.push(info[i].task)
            inner.push(info[i].priority)
            inner.push(info[i].status)
            inner.push(info[i].issued)
            inner.push(info[i].due)
            inner.push(info[i].completed)
            inner.push(info[i].timeBetween)
            console.log(inner)
            data.push(inner)
        }
    }  


    function download_csv() {
        var csv = 'id,UserId,Task,Priority,Status,Issued,Due,Completed,DaysBetween\n';
        data.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
            
        });

        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'orders.csv';
        hiddenElement.click();
    }

    $("#report").on("click", download_csv)




})