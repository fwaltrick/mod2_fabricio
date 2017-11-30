var html = location.pathname.split("/").slice(-1)

if (html == "house.html") {
    var jsonurl = "pro-congress-113-house.json";
} else if (html == "senate.html") {
    var jsonurl = "pro-congress-113-senate.json";
}

$.getJSON(jsonurl, function(data) {
    console.log(data)

    for (var i = 0; i < data.results[0].members.length; i++) {

        var member = data.results[0].members[i];
        var name = member.first_name;

        if (member.middle_name) name = name + " " + member.middle_name
        name = name + " " + member.last_name;

        var url = member.url;
        var state = member.state;
        var seniority = member.seniority;
        var votesParty = member.votes_with_party_pct;


        var content = "<tr>"

        content += "<td>" + "<a href='" + url + "'>" + name + "</a>" + "</td><td>" + member.party +
            "</td><td>" + state + "</td><td>" + seniority + "</td><td>" +
            votesParty + "</td></tr>";


        $('.congressData').append(content);
    }

});