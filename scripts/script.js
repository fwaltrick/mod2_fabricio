//HOME

//Function to change the button of the accordion in the homepage
$(".readMore").click(function() {
    $(this).text(function(index, currentText) {
        return currentText === 'Read Less' ? 'Read More' : 'Read Less';
    });
});

// SOLUTION Object Oriented


function DataHandler() {

    this.jsonUrl = "";
    this.chamber = "";
    this.jsonData = "";
    this.members = [];
    this.states = [];


    this.populateMenu = function() {
        $.getJSON("scripts/states.json", function(response) {
            var arrayStates = [];
            console.log(response);
            response.forEach(function(element) {
                var opt = $("<option>").text(element.name).attr("value", element.code);
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

    this.stats = function() {
        var sorted = [];
        var x;
        var statsPage = "loyalty";
        var that = this;

        var statsAttendance = {
            "num": {
                "D": 0,
                "R": 0,
                "I": 0
            },
            "engaged_avr": {
                "D": 0,
                "R": 0,
                "I": 0
            },
            "engaged_members": {
                "most": [],
                "least": []
            }
        };

        var statsLoyalty = {
            "loyalty_avr": {
                "D": 0,
                "R": 0,
                "I": 0
            },
            "loyal_members": {
                "most": [],
                "least": []
            }
        };


        $(this.members).each(function(i, member) {
            statsAttendance.num[member.party]++;
            statsAttendance.engaged_avr[member.party] += member.missed_votes_pct;
            statsLoyalty.loyalty_avr[member.party] += member.votes_with_party_pct;
        });

        for (x in statsAttendance.engaged_avr) {
            statsAttendance.engaged_avr[x] /= statsAttendance.num[x];
            statsLoyalty.loyalty_avr[x] /=  statsAttendance.num[x];
        }

        if (statsPage == "loyalty") {

            sorted = this.members.sort(function(a, b) {
                return b.votes_with_party_pct - a.votes_with_party_pct;
            });

            statsLoyalty.loyal_members.most = sorted.slice(0, Math.round(this.members.length * 0.1));
            statsLoyalty.loyal_members.least = sorted.slice(sorted.length - Math.round(this.members.length * 0.1));



        } else if (statsPage == "attendance") {
            sorted = this.members.sort(function(a, b) {
                return a.missed_votes_pct - b.missed_votes_pct;
            });

            statsAttendance.engaged_members.most = sorted.slice(0, Math.round(this.members.length * 0.1));
            statsAttendance.engaged_members.least = sorted.slice(sorted.length - Math.round(this.members.length * 0.1));
        }


        console.log(statsLoyalty);
        console.log(statsAttendance);


    }


    this.createTable = function() {
        var tRows = [];

        $(this.members).each(function(i, member) {
            if (tgifFilter[member.party]) {
                if (!tgifFilter.activeState || tgifFilter.activeState == member.state) {
                    var tr = $("<tr>");
                    var name = [member.first_name, member.middle_name, member.last_name].join(" ").replace("  ", " ")
                    var nameUrl = "<a href='" + member.url + "' target='_blank'>" + name + "</a>";
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
dataHandler.stats();
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
        console.log("should update parties now...", party, checked);
        this[party] = checked;
        dataHandler.updateTable();

    }

    this.updateState = function(state) {
        this.activeState = state;
        console.log("should update states now...", state);
        dataHandler.updateTable();

    }

}
var tgifFilter = new Filter();
console.log(tgifFilter);