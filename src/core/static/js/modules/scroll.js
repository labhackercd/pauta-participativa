var Scroll = {
  themeNavigation: function() {
    var themeNavigation = $('.JS-theme-navigation');
    var agendaHeader = $('.JS-agenda-header');
    var headerHeight = parseInt(agendaHeader.css('height'))
    if ($(document).scrollTop() >= (headerHeight)) {
      themeNavigation.addClass('-fixed');
    } else {
      themeNavigation.removeClass('-fixed');
    }
  }
}