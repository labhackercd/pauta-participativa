var Votes = {
  proposalIsVoted: function(target, sibling) {
    return sibling.prop('checked') || !target.prop('checked')
  },

  siblingCheckbox: function(checkbox) {
    var tickbox = checkbox.closest('.JS-tickbox');
    return tickbox.siblings('.JS-tickbox').find('.JS-vote-input');
  },

  getVoteType: function(checkbox) {
    return checkbox.val();
  },

  decrementCounter: function(voteType, groupId) {
    var group = $('.JS-group[data-group-id="' + groupId + '"]');
    var voteCounter = group.find('.-' + voteType + ':not(.-used).JS-vote-counter').first();
    voteCounter.addClass('-used');
  },

  incrementCounter: function(voteType, groupId) {
    var group = $('.JS-group[data-group-id="' + groupId + '"]');
    var voteCounter = group.find('.-' + voteType + '.-used.JS-vote-counter').first();
    voteCounter.removeClass('-used');
  },

  remainingVotes: function(voteType, groupId) {
    var group = $('.JS-group[data-group-id="' + groupId + '"]');
    var voteCounters = group.find('.-' + voteType + ':not(.-used).JS-vote-counter');
    return voteCounters.length
  },

  disableUnvoted: function(voteType, groupId) {
    var group = $('.JS-group[data-group-id="' + groupId + '"]');
    var selector = '.JS-vote-input[data-vote-type="' + voteType +
                   '"]:not(:checked)';
    group.find(selector).attr('disabled', true);
  },

  enableUnvoted: function(voteType, groupId) {
    var group = $('.JS-group[data-group-id="' + groupId + '"]');
    var selector = '.JS-vote-input[data-vote-type="' + voteType +
                   '"]:not(:checked)';
    group.find(selector).removeAttr('disabled');
  },

  checkUnvoted: function(voteType, groupId) {
    if (!this.remainingVotes(voteType, groupId)) {
      this.disableUnvoted(voteType, groupId);
    } else {
      this.enableUnvoted(voteType, groupId);
    }
  },

  downvoteIsAvailable: function(groupId) {
    var upvotesCount = this.remainingVotes('upvote', groupId);
    return upvotesCount === 0;
  },

  updateReview: function(vote, voteType, groupId, proposalId) {
    var groupReview = $('.JS-group-review[data-group-id="' + groupId + '"]');
    var proposalReview = groupReview.find('.JS-proposal-review[data-proposal-id="' + proposalId + '"]');
    if (vote) {
      proposalReview.addClass('-' + voteType);
    } else {
      proposalReview.removeClass('-' + voteType);
    }
  },
}

var Buttons = {
  changeNextButtonState: function(checkbox, groupId) {
    var nextButton = checkbox.closest('.JS-group').find('.JS-next-group-btn');
    var errorMessage = $('.JS-error-message');
    var voteType = Votes.getVoteType(checkbox);
    var downvoteNotAvailable = !Votes.downvoteIsAvailable(groupId);
    var unvote = !checkbox.prop('checked');
    var remainingDownvotes = Votes.remainingVotes('downvote', groupId);
    var remainingUpvotes = Votes.remainingVotes('upvote', groupId);
    if (voteType === 'downvote' && downvoteNotAvailable && !unvote) {
      nextButton.prop('disabled', true);
      nextButton.text('Próximo');
      errorMessage.addClass('-show');
    } else if (remainingDownvotes === 0 && remainingUpvotes === 0) {
      nextButton.prop('disabled', false);
      nextButton.text('Próximo');
      errorMessage.removeClass('-show');

    } else if (remainingDownvotes === 1 && remainingUpvotes < 2) {
      nextButton.prop('disabled', false);
      nextButton.text('Próximo');
      errorMessage.removeClass('-show');
    } else if (remainingDownvotes === 1 && remainingUpvotes === 2) {
      nextButton.prop('disabled', false);
      nextButton.text('Pular');
      errorMessage.removeClass('-show');
    } else {
      nextButton.prop('disabled', true);
      errorMessage.addClass('-show');
    }
  },
}

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
}

$('.JS-vote-input').click(function(event) {
  var target = $(event.target);
  var siblingCheckbox = Votes.siblingCheckbox(target);
  var voteType = Votes.getVoteType(target);
  var groupId = target.closest('.JS-group').data('groupId');
  var proposalId = target.closest('.JS-proposal').data('proposalId');

  if (Votes.proposalIsVoted(target, siblingCheckbox)) {
    if (!target.prop('checked')) {
      Votes.incrementCounter(voteType, groupId);
      Votes.updateReview(false, voteType, groupId, proposalId);
    } else {
      Votes.decrementCounter(voteType, groupId);
      Votes.updateReview(true, voteType, groupId, proposalId);
      $(siblingCheckbox).prop('checked', false);
      var siblingType = Votes.getVoteType(siblingCheckbox);
      Votes.incrementCounter(siblingType, groupId);
      Votes.updateReview(false, siblingType, groupId, proposalId);
      Votes.checkUnvoted(siblingType, groupId);
    }
  } else {
    if (Votes.remainingVotes(voteType, groupId)) {
      Votes.decrementCounter(voteType, groupId);
      Votes.updateReview(true, voteType, groupId, proposalId);
    } else {
      alert('sem votos disponiveis');
      return false;
    }
  }

  Votes.checkUnvoted(voteType, groupId);
  Buttons.changeNextButtonState(target, groupId);
})

$('.JS-next-group-btn').click(function(event) {
  var target = $(event.target);
  Tabs.next(target);
});

$('.JS-prev-group-btn').click(function(event) {
  var target = $(event.target);
  Tabs.previous(target);
});

$('.JS-tab-item').click(function(event) {
  var target = $(event.target);
  if (target.hasClass('-active')) {
    return false;
  } else {
    var groupId = target.data('groupId');
    var activeGroup = target.siblings('.JS-tab-item.-active').first();
    Tabs.changeActiveGroupTo(activeGroup.data('groupId'), groupId);
  }
});

$(window).scroll(function(event) {
  var headerHeight = $('.JS-agenda-header').outerHeight();
  var remainingVotes = $('.JS-remaining-votes');
  if ($(document).scrollTop() > headerHeight) {
    remainingVotes.addClass('-fixed');
  } else {
    remainingVotes.removeClass('-fixed');
  }
});

$('.JS-confirm-votes').submit(function(e) {
  var csrftoken = $(this).find('[name="csrfmiddlewaretoken"]').val();
  var recaptchaResponse = $(this).find('[name="g-recaptcha-response"]').val();
  var agendaId = $(this).closest('.JS-agenda').data('agendaId');
  if (!recaptchaResponse) {
    alert('Tem que marcar o reCaptcha');
    return false;
  }

  var data = {
    recaptchaResponse: recaptchaResponse,
    groups: []
  };

  $('.JS-group-form').each(function() {
    var groupId = $(this).closest('.JS-group').data('groupId');
    var groupData = {
      groupId: groupId,
      votes: $(this).serializeArray()
    };
    data.groups.push(groupData);
  })

  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  });

  $.ajax({
    method: 'POST',
    url: window.Urls.agenda(agendaId),
    data: {data: JSON.stringify(data)},
    success: function(data) {
      location.reload();
    },
    error: function(data) {
      alert(data.responseJSON.message);
    }
  })

  return false;
})