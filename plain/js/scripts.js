$(function() {

  //render the scene
  var selectedProjectsTemplate = Handlebars.compile($('#selected-projects').html());
  var contactMethodsTemplate = Handlebars.compile($('#contact-methods').html());
  var menuOptionsTemplate = Handlebars.compile($('#menu-options').html());

  //render
  $('.selected-projects-content').html(selectedProjectsTemplate(data.selectedProjects));
  $('.contact-content').html(contactMethodsTemplate(data.contact));
  $('.main-menu-options').html(menuOptionsTemplate(data.mainMenu));

  //wire it all up
  $(document).ready(function () {
    var
      header = $('#headerText'),
      pagesections = $('.pagesection'),
      main = $("#main"),
      project = $("#project"),
      projects = $('.project'),
      nav = $('.nav'),
      mainMenu = $('.main-menu-options'),
      menuOptions = $('.menu'),
      menuBuffer = $('#czengg')[0].offsetTop,
      current = 0,
      lastScrollTop = 0
    ;

    var containerTops = pagesections.map(function(i) {
      var container = pagesections[i];
      var obj = {};
      obj['top'] = container.offsetTop;
      obj['bottom'] = container.offsetTop + container.offsetHeight;
      obj['heading'] = container.dataset.content;
      return obj;
    });

    var compareTops = function (a, b) {
      if (a.top < b.top)
        return -1;
      if (a.top > b.top)
        return 1;
      return 0;
    };

    var changeHeader = function () {
      var scrollTop = $(window).scrollTop() + menuBuffer;

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

    var showPage = function (topage, frompage) {
      var pageWidth = frompage.width();
      topage.css("left", pageWidth);
      topage.addClass("active-page");
      topage.add(frompage).animate({
          "left": "-=" + pageWidth + "px"
      }, 300).promise().done(function() {
          frompage.removeClass('active-page');
      });
    }

    containerTops.sort(compareTops);
    changeHeader();

    $(window).scroll(function () {
      changeHeader();
    });

    projects.click(function (e) {
      e.preventDefault();

      var frompage = $(this).parent().parent().parent().parent().parent(),
          topage = frompage.siblings('.page');

      showPage(topage,frompage);
    });

    nav.click(function (e) {
      e.preventDefault();

      mainMenu.slideToggle();
    });

    menuOptions.click(function (e) {
      e.preventDefault();

      window.scrollTo(0, $('#' + this.dataset.content)[0].offsetTop - menuBuffer);
    });

  });

});
