$(document).ready(function () {
    $.get("/api/user", display)

    function display(data) {
        for (var i = 0; i < data.length; i++) {
            var actives = []
            var count = 0;
            console.log(i + " | " + actives)            
            for (var j = 0; j < data[i].WorkOrders.length; j++) {
                var count = 0;
                actives.push(data[i].WorkOrders[j].status)
                var search = 'active'
                var count = actives.reduce(function(n, val) {
                    return n + (val === search);
                },0) 
                console.log(count + " in the push loop")
            }
            console.log(count + " out of the push loop")
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
            console.log("no")
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
})