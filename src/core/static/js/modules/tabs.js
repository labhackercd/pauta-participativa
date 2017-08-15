var Tabs = {
  changeActiveGroup: function(current, next) {
    var tabNavigation = $('.JS-tab-navigation');

    current.removeClass('-active');
    var currentGroupId = current.data('groupId');
    var currentTab = tabNavigation.find('.JS-tab-item[data-group-id="' + currentGroupId + '"]');
    currentTab.removeClass('-active');

    next.addClass('-active');
    var nextGroupId = next.data('groupId');
    var nextTab = tabNavigation.find('.JS-tab-item[data-group-id="' + nextGroupId + '"]');
    nextTab.addClass('-active');

    $("html, body").animate({ scrollTop: 0 }, "fast");
  },

  next: function(nextButton) {
    var group = nextButton.closest('.JS-group');
    var nextGroup = group.next('.JS-group,JS-votes-review');
    this.changeActiveGroup(group, nextGroup);
  },

  previous: function(prevButton) {
    var group = prevButton.closest('.JS-group');
    var nextGroup = group.prev('.JS-group');
    this.changeActiveGroup(group, nextGroup);
  },

  changeActiveGroupTo: function(currentGroupId, targetGroupId) {
    var target = $('.JS-group[data-group-id="' + targetGroupId + '"]');
    var current = $('.JS-group[data-group-id="' + currentGroupId + '"]');
    this.changeActiveGroup($(current), $(target));
  },

  disableAllUnless: function(groupId) {
    $('.JS-tab-item[data-group-id!="' + groupId + '"]').addClass('-disabled');
  },

  enableAll: function() {
    $('.JS-tab-item').removeClass('-disabled');
  }
}