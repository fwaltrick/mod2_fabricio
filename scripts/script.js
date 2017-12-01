
//Fuction to change the button of the accordion in the homepage
$(".readMore").click(function(){
     $(this).text(function(index, currentText) {
         return currentText === 'Read Less' ? 'Read More' : 'Read Less';
     });
});

// My first solution: determining the chamber by the HTML file
//
// var html = location.pathname.split("/").slice(-1)

//  if (html == "house") {
//      var jsonurl = "pro-congress-113-house.json";
//  } else if (html == "senate.html") {
//      var jsonurl = "pro-congress-113-senate.json";
//  }


// Christoph's solution: data attributes

var chamber = $("body").data("chamber"); 
var jsonurl = "pro-congress-113-" + chamber + ".json"


if (typeof chamber !== 'undefined') {  // to avoid error in home.html
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

        content += "<td>" + "<a href='" + url + "'>" + name + "</a>"
        content += "<td>" + member.party;
        content += "<td>" + state; 
        content += "<td>" + seniority; 
        content += "<td>" + votesParty;


        $('.congressData').append(content);
    }

});
}