MathJax.Hub.Config({
    tex2jax: {
        preview: "none",
        inlineMath: [['$', '$'], ["\\(", "\\)"]],
        processEscapes: true
    },
    messageStyle: "none"

});

$(document).ready(function () {
    setStickyMenu();
    doAccordion();
    $('table').addClass("table");

    $('.navbar-static-top').stick_in_parent({
        bottoming: false,
    });

    $(window).on('resize', function () {
        setStickyMenu();
    });

    bindEventListener();
});

function doAccordion() {
    $("#accordion-1").dcAccordion({
        eventType: 'click',
        autoClose: false,
        saveState: false,
        disableLink: false,
        speed: 0,
        showCount: true,
        autoExpand: true,
        cookie: 'dcjq-accordion-1',
        classExpand: 'dcjq-current-parent'
    });
}

function setStickyMenu() {
    var options = {
        bottoming: false,
        offset_top: 67,
        inner_scrolling: false
    };

    var sticky = "#TOC";
    var width = $(window).width();

    if (width >= 768) {
        console.log('fold in');
        $(sticky).stick_in_parent(options);
        $(".toc ul").attr('id', 'accordion-1');

    } else {
        $(".toc ul").attr('id', '');
        $(sticky).trigger("sticky_kit:detach");
        console.log('fold out');
    }
};

function search(keyword) {
    //clear search result
    $('#search_result h4').remove();

    if(keyword === ''){
        $('#search_result').hide();
        return;
    }

    //start search
    var pattern = keyword.toLowerCase();
    $(".content ol > li").each(function (index, item) {
        let pos = $(this).text().toLowerCase().indexOf(pattern);
        if(pos > -1){
            let h3Element = $(this).parent().prevAll('h3').first();
            let targetId = h3Element.attr('id');
            $('#search_result').append('<h4><a href="#' + targetId + '">...' + $(this).text().substring(pos-10, pos+10) + '...</a></h4>');
        }
    });

    if($('#search_result h4').length > 0){
        $('#search_result').show();
    }

    window.location.href = '#search_result';
}

function bindEventListener() {
    //setup before functions
    let typingTimer;                //timer identifier
    let doneTypingInterval = 300;  //time in ms, 5 second for example
    let searchQuery = document.getElementById("search_input");

    //on keyup, start the countdown
    searchQuery.addEventListener('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    //on keydown, clear the countdown 
    searchQuery.addEventListener('keydown', function () {
        clearTimeout(typingTimer);
    });

    //user is "finished typing," do something
    function doneTyping() {
        let keyword = document.getElementById("search_input").value;
        search(keyword);
    }
}
