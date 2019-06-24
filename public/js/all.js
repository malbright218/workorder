$(document).ready(function () {

    $("#goHome").on("click", function () {
        window.location.href = "index.html"
    })

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
        // Getting the current date for marking when a task is completed
        var dateArr = [];
        var idArr = []
        idArr.push(this.id-1)
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var end = d.getFullYear() + '/' +
            (month < 10 ? '0' : '') + month + '/' +
            (day < 10 ? '0' : '') + day;
        // END
        $.get("/api/orders", getDate)

        function getDate(data) {
            
            var i = idArr[0]
            console.log(idArr)
            console.log(data[i])
            
            var dateDue = data[i].issued
            var converted = moment(dateDue).add(1, 'days').format("MM-DD-YYYY")
            console.log(converted)
            dateArr.push(converted)
            var start = dateArr[0]
            var start1 = new Date(start)
            var end1 = new Date(end)
            var diff = new Date(end1 - start1)
            var days = diff/1000/60/60/24;
            console.log(days)
            var updateTask = {}
            updateTask.id = i+1
            updateTask.status = "completed"
            updateTask.completed = moment(end1).format("YYYY-MM-DD")
            updateTask.timeBetween = days
            console.log(updateTask)
          
            // console.log(thisasdas)
            update(updateTask)
        }


    })

    function update(x) {
        $.ajax({
            method: "PUT",
            url: "/api/orders",
            data: x
        })
        location.reload()
    }

    $("#headSort").on("click", sortTable)

    function sortTable() {
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("tableSort");
        switching = true;
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /*Loop through all table rows (except the
            first, which contains table headers):*/
            for (i = 1; i < (rows.length - 1); i++) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                /*Get the two elements you want to compare,
                one from current row and one from the next:*/
                x = rows[i].getElementsByTagName("TD")[0];
                y = rows[i + 1].getElementsByTagName("TD")[0];
                //check if the two rows should switch place:
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                /*If a switch has been marked, make the switch
                and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }




})