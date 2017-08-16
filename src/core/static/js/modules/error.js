var errorMessage = $('.JS-error-message');

var ErrorMessage = {
  show: function() {
    errorMessage.addClass('-show');
    setTimeout(function() {
      errorMessage.find('.JS-error-close').click();
    }, 6500);
  },

  hide: function() {
    errorMessage.removeClass('-show');
    errorMessage.find('.JS-error-close').click();
  }
}