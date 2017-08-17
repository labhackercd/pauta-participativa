jQuery.fn.extend({
  tooltip: function() {
    return this.each(function() {
      var parent = $(this);
      console.log($(parent))
      if (parent.data('tooltip').length) {
        parent.append('<span class="tooltip-box JS-tooltip" role="tooltip">' + parent.data('tooltip') + '</span>');
      }
    })
  },

  removeTooltip: function() {
    return this.each(function() {
      var parent = $(this);
      parent.find('.JS-tooltip').remove();
    })
  }
})

$('[data-tooltip]:not([data-hide-tooltip])').tooltip();