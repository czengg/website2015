$(function() {

  //render the scene
  var selectedProjectsTemplate = Handlebars.compile($('#selected-projects').html());
  var contactMethodsTemplate = Handlebars.compile($('#contact-methods').html());

  //render
  $('.selected-projects-content').html(selectedProjectsTemplate(data.selectedProjects));
  $('.contact-content').html(contactMethodsTemplate(data.contact));

  //wire it all up
  $(document).ready(function () {
    var pagesections = $('.pagesection');
    var containerTops = pagesections.map(function(i) {
      var container = pagesections[i];
      var obj = {};
      obj['top'] = container.offsetTop;
      obj['bottom'] = container.offsetTop + container.offsetHeight;
      obj['heading'] = container.dataset.content;
      return obj;
    });
    var header = $('#headerText');
    var current = 0;
    var lastScrollTop = 0;

    var compareTops = function (a, b) {
      if (a.top < b.top)
        return -1;
      if (a.top > b.top)
        return 1;
      return 0;
    };

    var changeHeader = function () {
      var scrollTop = $(window).scrollTop();

      if (scrollTop > lastScrollTop) {
        var next;

        while (scrollTop > containerTops[current].top) {
          next = current + 1;

          if (scrollTop < containerTops[current].bottom || current === containerTops.length)
            break;

          current = next;
        }
      } else {
        var prev;

        while (scrollTop < containerTops[current].bottom) {
          prev = current - 1;

          if (scrollTop > containerTops[current].top || current === 0)
            break;

          current = prev;
        }
      }

      header.html(containerTops[current].heading.toUpperCase());
      lastScrollTop = scrollTop;
    };

    containerTops.sort(compareTops);
    changeHeader();

    $(window).scroll(function () {
      changeHeader();
    });
  });

});
