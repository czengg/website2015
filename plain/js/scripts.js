$(function() {

  //create dataset
  var projectsData = {};
  var projectsMenu = [];
  data.selectedProjects.map(function (obj) {
    obj.projects.map(function (pObj) {
      projectsData[pObj.id] = pObj;
      projectsData[pObj.id].category = obj.id;

      var mObj = {};
      mObj.id = pObj.id;
      mObj.title = obj.sectionHeader.toUpperCase() + ': ' + pObj.title.toUpperCase();
      projectsMenu.push(mObj);
    });
  });

  //render the scene
  var selectedProjectsTemplate = Handlebars.compile($('#selected-projects').html());
  var contactMethodsTemplate = Handlebars.compile($('#contact-methods').html());
  var menuOptionsTemplate = Handlebars.compile($('#menu-options').html());

  //render
  $('.selected-projects-content').html(selectedProjectsTemplate(data.selectedProjects));
  $('.contact-content').html(contactMethodsTemplate(data.contact));
  $('.main-menu-options').html(menuOptionsTemplate(data.mainMenu));
  $('.project-menu-options').html(menuOptionsTemplate(projectsMenu));

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
      projectMenu = $('.project-menu-options'),
      menuOptions = $('.menu'),
      menuBuffer = $('.content')[0].offsetTop + parseInt($('.content').css('padding-top')),
      projectDate = $('#projectDate'),
      projectTitle = $('#projectTitle'),
      projectSkills = $('#projectSkills'),
      projectMedia = $('#projectMedia'),
      projectDescription = $('#projectDescription'),
      currentPage = "main",
      current = 0,
      lastScrollTop = 0,
      navOpen = false
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

        while (scrollTop < containerTops[current].top) {
          prev = current - 1;

          if (scrollTop > containerTops[current].bottom || current === 0)
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
    };

    var toggleMenu = function () {
      navOpen = !navOpen;
      navOpen ? nav.addClass('opened') : nav.removeClass('opened');

      mainMenu.slideToggle();
      projectMenu.slideToggle();
    };

    var closeMenu = function () {
      navOpen = false;
      nav.removeClass('opened');
      mainMenu.slideUp();
      projectMenu.slideUp();
    };

    var populateProject = function (id) {
      var projectData = projectsData[id];

      projectDate.html(projectData.dates);
      projectTitle.html(projectData.title);
      projectSkills.html(projectData.skills);
      projectDescription.html(projectData.desc);
    };

    containerTops.sort(compareTops);
    changeHeader();

    $(window).scroll(function () {
      changeHeader();
    });

    projects.click(function (e) {
      e.preventDefault();
      populateProject(e.currentTarget.id);

      currentPage = "project";
      closeMenu();

      var frompage = $(this).parent().parent().parent().parent().parent(),
          topage = frompage.siblings('.page');

      showPage(topage,frompage);
    });

    nav.click(function (e) {
      e.preventDefault();

      toggleMenu();
    });

    menuOptions.click(function (e) {
      e.preventDefault();

      if (currentPage === "main")
        window.scrollTo(0, $('#' + this.dataset.content)[0].offsetTop - menuBuffer);
      else if (currentPage === "project")
        populateProject(e.currentTarget.dataset.content);

      closeMenu();
    });

  });

});
