setTimeout = (function( oldsetTimeout){
  var registered=[],
  f = function(a,b){
      return registered[ registered.length ] = oldsetTimeout(a,b);
  };
   f.clearAll = function(){
      var r;
      while( r = registered.pop()) {
        clearInterval( r );
      }
  };
  return f;
})(window.setTimeout);

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
      Tabs.disableAllUnless(groupId);
      errorMessage.addClass('-show');
      setTimeout(function() {
        errorMessage.find('.JS-error-close').click();
      }, 6500);
    } else if (remainingDownvotes === 0 && remainingUpvotes === 0) {
      nextButton.prop('disabled', false);
      nextButton.text('Próximo');
      Tabs.enableAll();
      errorMessage.removeClass('-show');
      errorMessage.find('.JS-error-close').click();
    } else if (remainingDownvotes === 1 && remainingUpvotes < 2) {
      nextButton.prop('disabled', false);
      nextButton.text('Próximo');
      Tabs.enableAll();
      errorMessage.removeClass('-show');
      errorMessage.find('.JS-error-close').click();
    } else if (remainingDownvotes === 1 && remainingUpvotes === 2) {
      nextButton.prop('disabled', false);
      nextButton.text('Pular');
      Tabs.enableAll();
      errorMessage.removeClass('-show');
      errorMessage.find('.JS-error-close').click();
    } else {
      nextButton.prop('disabled', true);
      Tabs.disableAllUnless(groupId);
      errorMessage.addClass('-show');
      setTimeout(function() {
        errorMessage.find('.JS-error-close').click();
      }, 6500);
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

var Show = {
  // more: function(target) {
  //   var proposal = target.closest('.JS-proposal');
  //   proposal.find('.JS-more-info').addClass('-show');
  //   target.removeClass('JS-show-more');
  //   target.addClass('-active JS-show-less');
  // },

  // less: function(target) {
  //   var proposal = target.closest('.JS-proposal');
  //   proposal.find('.JS-more-info').removeClass('-show');
  //   target.removeClass('-active JS-show-less');
  //   target.addClass('JS-show-more');
  // }
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
  if (target.hasClass('-active') || target.hasClass('-disabled')) {
    return false;
  } else {
    var groupId = target.data('groupId');
    var activeGroup = target.siblings('.JS-tab-item.-active').first();
    Tabs.changeActiveGroupTo(activeGroup.data('groupId'), groupId);
  }
});

if ($('.JS-remaining-votes').length) {
  var remainingVotesOffset = $('.JS-remaining-votes').offset().top;
  $(window).scroll(function(event) {
    var remainingVotes = $('.JS-remaining-votes');
    var margin = parseInt(remainingVotes.css('margin-top'))
    if ($(document).scrollTop() >= (remainingVotesOffset - margin)) {
      remainingVotes.addClass('-fixed');
    } else {
      remainingVotes.removeClass('-fixed');
    }
  });
}

$('.JS-show').click(function(event) {
  var target = $(event.target);
  if (target.hasClass('JS-show-more')) {
    Show.more(target);
  } else if (target.hasClass('JS-show-less')) {
    Show.less(target);
  }
});

$('.JS-change-votes').click(function(event) {
  var target = $(event.target);
  var groupId = target.closest('.JS-group-review').data('groupId');
  Tabs.changeActiveGroupTo('finish', groupId);
});

$('.JS-error-close').click(function(event) {
  var target = $(event.target);
  target.closest('.JS-error-message').removeClass('-show');
  setTimeout.clearAll();
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