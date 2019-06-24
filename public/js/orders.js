$(document).ready(function () {

    var assignedUsers = [];
    $.get("/api/user", go)
    $.get("/api/orders", display)

    function go(data) {
        for (var i = 0; i < data.length; i++) {

            var s = data
            function compare(a, b) {
               if (a.id < b.id) {
                   return -1;
               }
               if (a.id > b.id) {
                   return 1
               }
               return 0
            }
            s.sort(compare)

            assignedUsers.push(data[i].name)
        }        
    }   

    function display(data) {
        for (var i = 0; i < data.length; i++) {
            var dateDue = data[i].due
            var converted = moment(dateDue).add(1, 'days').format("MM-DD-YYYY")
            var currentDate = new Date();
            var givenDate = dateDue
            givenDate = new Date(givenDate)   
            // console.log(assignedUsers)
            if (data[i].status === 'active') {
                // console.log(assignedUsers)
                var assigned = data[i].UserId
                var z = assigned -1 
                // console.log(z)
                // console.log(data)
                // console.log(assignedUsers)  
                var blankRow = $("<tr>")
                var td1 = $("<td>") // Assigned User
                var td2 = $("<td>") // Priority level
                var td3 = $("<td>") // Body of text
                var td4 = $("<td>") // Due date
                var td5 = $("<td>") // Task status
                var td6 = $("<td>") // Complete action, check button
                td6.addClass("table-btn")
                td1.append(assignedUsers[z])
                console.log(assignedUsers[z])
                td2.append(data[i].priority)
                td3.append(data[i].task)
                td4.append(converted)
                if (givenDate < currentDate) {
                    td5.append("late")
                    blankRow.addClass("late")
                    blankRow.css("color", "#fff")
                } else {
                    td5.append(data[i].status)
                }

                // var button = $("<button>")
                // button.addClass("btn btn-success btn-xs")
                // button.attr("id", data[i].id)
                // var icon1 = $("<i style='color: #fff'>")
                // icon1.addClass("fas fa-check")
                // button.append(icon1)
                // td6.append(button)
                blankRow.append(td1, td2, td3, td4, td5)
                $("#orderTarget").append(blankRow)
            }

            
        }
    }

    $(document).on("click", ".btn-success", function() {
        console.log(this.id)
        var updateTask = {}
        updateTask.id = this.id
        updateTask.status = "completed"
        update(updateTask)

    })

    function update(x) {
        $.ajax({
            method: "PUT",
            url: "/api/orders",
            data: x
        })
        location.reload()
    }

})