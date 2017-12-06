//HOME

//Function to change the button of the accordion in the homepage
$(".readMore").click(function() {
    $(this).text(function(index, currentText) {
        return currentText === 'Read Less' ? 'Read More' : 'Read Less';
    });
});


// SENATE/HOUSE
// My first solution: determining the chamber by the HTML file
//
// var html = location.pathname.split("/").slice(-1)

//  if (html == "house") {
//      var jsonurl = "pro-congress-113-house.json";
//  } else if (html == "senate.html") {
//      var jsonurl = "pro-congress-113-senate.json";
//  }



// var chamber = $("body").data("chamber"); // get senate or house
// var jsonurl = "pro-congress-113-" + chamber + ".json";

// if (typeof chamber !== 'undefined') { // to avoid error in home.html (where there's no chamber data)
//     $.getJSON(jsonurl, function(data) {
//         var members = data.results[0].members;
//     })
// }

// SOLUTION Object Oriented



function DataHandler() {

    this.jsonUrl = "";
    this.chamber = "";
    this.jsonData = "";
    this.members = [];
    this.states = [];

    this.populateMenu = function() {
    $.getJSON("scripts/states.json", function(response){
        var arrayStates = [];
        console.log(response);
        response.forEach(function(element){
            var opt = $("<option>").text(element.name).attr("value",element.code);
            arrayStates.push(opt);
        })
        $("#filterState").append(arrayStates);
    })

}



    this.start = function() {
        this.chamber = $("body").data("chamber"); // get senate or house
        this.jsonUrl = "pro-congress-113-" + this.chamber + ".json";
    }

    this.loadJson = function() {
        var that = this;
        if (typeof that.chamber !== 'undefined') { // to avoid error in home.html (where there's no chamber data)
            $.getJSON(this.jsonUrl, function(response) {
                that.jsonData = response;
                that.members = that.jsonData.results[0].members;
                that.createTable();
            })
        }

    }

    this.createTable = function() {
        var tRows = [];

        $(this.members).each(function(i,member) {
            if (tgifFilter[member.party]) {
                if  (!tgifFilter.activeState || tgifFilter.activeState==member.state) {
                var tr = $("<tr>");
                var name = [member.first_name, member.middle_name, member.last_name].join(" ").replace("  ", " ")
                var nameUrl = "<a href='" + member.url + "'>" + name + "</a>";
                tr.append($("<td>").append(nameUrl));
                tr.append($("<td>").text(member.party));
                tr.append($("<td>").text(member.state));
                tr.append($("<td>").text(member.seniority));
                tr.append($("<td>").text(member.votes_with_party_pct));
                tRows.push(tr);
            }
        }
        })
        $("#membersTable tbody").append(tRows);
    }

    this.updateTable = function() {
        $("#membersTable tbody").html("");
        this.createTable();
    }
}

var dataHandler = new DataHandler();
dataHandler.start();
dataHandler.populateMenu();
dataHandler.loadJson();
console.log(dataHandler);

$("#filterParty input[type=checkbox]").on("change", function() {
    console.log("new checkbox");
    tgifFilter.updateParty($(this).val(), $(this).prop("checked"))
})

$("#filterState").on("change", function() {
    console.log("new checkbox");
    tgifFilter.updateState($(this).val())
})

function Filter() {

    this.D = true;
    this.R = true;
    this.I = true;

    this.activeState = "";

    this.updateParty = function(party, checked) {
        console.log("should update parties now...", party, checked)
        this[party] = checked;
        dataHandler.updateTable();

    }

    this.updateState = function(state) {
        this.activeState = state;
        console.log("should update states now...", state)
        dataHandler.updateTable();

    }

}
var tgifFilter = new Filter();
console.log(tgifFilter);