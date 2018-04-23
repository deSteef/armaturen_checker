var smallGrid = false;

function toggleZoom() {
    var thisEl = $(this).closest(".armatuur");
    if (thisEl.hasClass('zoom-in')) {
        thisEl.removeClass('zoom-in');
    } else {
        thisEl.addClass('zoom-in');
    }
}

function toggleColumns(bool) {
    if (bool) {
        $('.armatuur').removeClass('armatuur-sm');  
    } else {
        $('.armatuur').addClass('armatuur-sm');      
    }
}
/**
 * Search in JSON for armaturen. 
 * @param string query search value
 * @param string attribute compare query with name or fabrikant of armatuur
 */

function getArmaturen(query, attribute) {
    $.getJSON('json/armaturen.json', function(result) {
        var divElements = $.map(result, function(armatuur, i) {
            // search in attribute name, limit = 10
            if (attribute === 'name') {
                if (armatuur.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                    var divArmatuur = $("<div></div>");
                    divArmatuur.append("<img src=\"images/" + armatuur.image + "\"></img>");
                    divArmatuur.append("<p>"+armatuur.name + "</p>");
                    divArmatuur.addClass("armatuur");
                    if (smallGrid) {
                        divArmatuur.addClass("armatuur-sm");
                    }
                    return divArmatuur;
                } else {
                    return;
                }
            // compare fabrikant
            } else if (attribute === 'fabrikant') {
                if (armatuur.fabrikant.toLowerCase() === query.toLowerCase()) {
                    var divArmatuur = $("<div></div>");
                    divArmatuur.append("<img src=\"images/" + armatuur.image + "\"></img>");
                    divArmatuur.append("<p>"+armatuur.name + "</p>");
                    divArmatuur.addClass("armatuur");
                    if (smallGrid) {
                        divArmatuur.addClass("armatuur-sm");
                    }
                    return divArmatuur;
                } else {
                    return;
                }
            } else {
                console.log('error occured. Searching for: ' + query + ' within ' + attribute);
            }
        });
        // print results
        $(".content").find(".armatuur").remove();
        $(".content").append(divElements).hide().fadeIn();

    }); 
}

function search() {
    var query = $("#searchInputField").val();
    getArmaturen(query, 'name');
}

function loadFabrikant() {
    var query = $(this).text();
    getArmaturen(query, 'fabrikant');
}

function lazyLoad() {
    var notYetLoaded = $(".content").find(".loader");
    if (notYetLoaded.length < 1) {
        $.ajax('json/armaturen.json', {
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function() {
                var loadIndicator = $("<div></div>");
                loadIndicator.append("<div class=\"lds-roller\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>");
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
                    divArmatuur.append("<img src=\"images/" + armatuur.image + "\"></img>");
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
                errorDiv.css({"color":"red", "display":"inline-block","width":"100%"}); // use css method for practice
                errorDiv.css({"font-weight":"bold","font-size":"1.5em","text-align":"center"});
                $(".content").append(errorDiv).delay(2500).fadeIn();
            }
        });
    }
}

jQuery(function($){
    search();
    $(".menu").on('click','a', loadFabrikant);
    $("#searchInputField").on('keyup', search);
    $("body").on('click', ".armatuur", toggleZoom);
    $("h1").on('click', function() {
        $("input[type=text]").val(null);
        getArmaturen('', 'name');
    });
    $('button').on('click',function() {
        $(this).addClass("selected");
        $(this).siblings().removeClass('selected');
        smallGrid = ($(this).text() === 'small') ? false : true;
        toggleColumns(smallGrid);
        smallGrid = !smallGrid;
    });

    $(window).scroll(function() {   
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            lazyLoad();
        }
    });
    
});