function stretchImage() {
    var armatuur = $(this).closest(".armatuur");
    armatuur.toggleClass("clicked");
    if (armatuur.hasClass("clicked")) {
        $(".armatuur").not(armatuur).fadeOut(200, function() {
            armatuur.animate({'width':'100%'}, 200);
        });
    } else {
        armatuur.animate({'width':'25%'}, 200, function() {
            $(".armatuur").fadeIn(200);
        });
    }
}

function lightsOn() {
    var url = $(this).closest(".armatuur").children("img").attr("src");
    var armatuur = $("<img></img>");
    armatuur.attr("src", url);
    $(".container").hide();
    $("body").css({"background-color": "#000"})
    armatuur.addClass("lightbox");
    $("body").append(armatuur).hide().fadeIn();
}

function lightsOff() {
    $("body").css({"background-color": "#eee"});
    $(".container").show().fadeIn();
    $(this).hide().fadeOut();
}

function loadProject1() {
    $.getJSON('src/json/project1.json', function(result) {
        var divElements = $.map(result, function(armatuur, i) {
            var divArmatuur = $("<div></div>");
            divArmatuur.append("<img src=\"" + armatuur.image + "\"></img>");
            divArmatuur.append("<p>"+armatuur.name + "</p>");
            divArmatuur.addClass("armatuur");
            return divArmatuur;
        });
        var projectName = $(document).find("#project1").text();
        $(document).find(".title").find("h1").html(projectName);
        $(".content").find(".armatuur").remove();
        $(".content").append(divElements).hide().fadeIn();
    });
}

function loadProject2() {
    $.getJSON('src/json/project2.json', function(result) {
        var divElements = $.map(result, function(armatuur, i) {
            var divArmatuur = $("<div></div>");
            divArmatuur.append("<img src=\"" + armatuur.image + "\"></img>");
            divArmatuur.append("<p>"+armatuur.name + "</p>");
            divArmatuur.addClass("armatuur");
            return divArmatuur;
        });
        var projectName = $(document).find("#project2").text();
        $(document).find(".title").find("h1").html(projectName);
        $(".content").find(".armatuur").remove();
        $(".content").append(divElements).hide().fadeIn();
    });
}

function search() {
    var query = $("#searchInputField").val();
    $.getJSON('src/json/alle-armaturen.json', function(result) {
        var divElements = $.map(result, function(armatuur, i) {

            if (armatuur.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                var divArmatuur = $("<div></div>");
                divArmatuur.append("<img src=\"" + armatuur.image + "\"></img>");
                divArmatuur.append("<p>"+armatuur.name + "</p>");
                divArmatuur.addClass("armatuur");
                return divArmatuur;
            } else {
                return;
            }
        });

        // reset header
        var header = "<span>Armaturen</span> checker";
        $(document).find(".title").find("h1").html(header);

        // print results
        $(".content").find(".armatuur").remove();
        $(".content").append(divElements).hide().fadeIn();
    });
    
}

function lazyLoad() {
    var notYetLoaded = $(".content").find(".loader");
    if (notYetLoaded.length < 1) {
        $.ajax('src/json/alle-armaturen.json', {
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function() {
                var loadIndicator = $("<div></div>");
                loadIndicator.append("<img src=\"src/icons/loading.svg\"></img>");
                loadIndicator.addClass("loader");
                $(".content").append(loadIndicator);
            },
            complete: function() {
                $(".content").find(".loader").delay(2500).slideUp();
                setTimeout(function() {
                    $(".content").find(".loader").remove();  
                },4000);
            },
            success: function(result) {
                // load all 
                var divElements = $.map(result, function(armatuur, i) {
                    var divArmatuur = $("<div></div>");
                    divArmatuur.append("<img src=\"" + armatuur.image + "\"></img>");
                    divArmatuur.append("<p>"+armatuur.name + "</p>");
                    divArmatuur.addClass("armatuur");
                    return divArmatuur;
                });
                var newItem = $("<div></div>").append(divElements).hide();
                $(".content").append(newItem);
                newItem.delay(2500).fadeIn();
            },
            error: function(error) {
                var errorDiv = $("<div></div>");
                errorDiv.append("<p>Error fetching data</p>");
                errorDiv.css({"color":"red", "display":"inline-block","width":"100%"}); // use css method
                errorDiv.css({"font-weight":"bold","font-size":"1.5em"});
                $(".content").append(errorDiv).delay(2500).fadeIn();
            }
        });
    }
}


jQuery(function($){
    search();
    $("#project1 a").on('click', loadProject1);
    $("#project2 a").on('click', loadProject2);
    $("#searchInputField").on('keydown', search);
    $("body").on('click', ".armatuur", lightsOn);
    $("body").on('click', ".lightbox", lightsOff);

    $(window).scroll(function() {   
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            lazyLoad();
        }
    });
    
});