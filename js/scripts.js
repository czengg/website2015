$(function() {

  //render the scene
  var selectedProjectsTemplate = Handlebars.compile($('#selected-projects').html());

  //render
  $('.selected-projects-content').html(selectedProjectsTemplate(data.selectedProjects));

  //wire it all up


});