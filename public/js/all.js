$(document).ready(function () {

    $("#goHome").on("click", function () {
        window.location.href = "index.html"
    })

    var assignedUsers = [];
    $.get("/api/user", go)
    $.get("/api/orders", display)

    function go(data) {
        for (var i = 0; i < data.length; i++) {
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
            var assigned = data[i].UserId
            var z = assigned - 1
            var blankRow = $("<tr>")
            var td1 = $("<td>") // Assigned User
            var td2 = $("<td>") // Priority level
            var td3 = $("<td>") // Body of text
            var td4 = $("<td>") // Due date
            var td5 = $("<td>") // Task status
            var td6 = $("<td>") // Complete action, check button
            td6.addClass("table-btn")

            td1.append(assignedUsers[z])
            td2.append(data[i].priority)
            td3.append(data[i].task)
            td4.append(converted)

            if (data[i].status === 'completed') {
                td5.append(data[i].status)
            } else if (givenDate < currentDate) {
                td5.append("late")
                blankRow.addClass("late")
                blankRow.css("color", "#fff")
            } 
            var button1 = $("<button>")
            button1.addClass("btn btn-danger btn-xs")
            button1.attr("id", data[i].id)
            var icon1 = $("<i style='color: #fff'>")
            icon1.addClass("far fa-trash-alt")
            button1.append(icon1)

            var button2 = $("<button>")
            button2.addClass("btn btn-success btn-xs")
            button2.attr("id", data[i].id)
            var icon2 = $("<i style='color: #fff'>")
            icon2.addClass("fas fa-check")
            button2.append(icon2)
            td6.append(button1, button2)


            blankRow.append(td1, td2, td3, td4, td5, td6)
            $("#orderTarget").append(blankRow)
        }
    }

    $(document).on("click", ".btn-danger", function () {
        console.log(this.id)
        var task = this.id
        console.log(task)
        deletePost(task)

    })

    function deletePost(id) {
        $.ajax({
            method: "DELETE",
            url: "/api/orders/" + id
        })
        location.reload()
    }

    $(document).on("click", ".btn-success", function () {
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