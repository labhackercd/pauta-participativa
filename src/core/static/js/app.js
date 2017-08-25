
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
  Buttons.changeButtonsState(target, groupId);
})

$('.JS-next-group-btn').click(function(event) {
  var target = $(event.target);
  if (target.hasClass('-disabled')) {
    AlertMessage.remainingVotesError();
    return false;
  }
  Tabs.next(target);
});

$('.JS-prev-group-btn').click(function(event) {
  var target = $(event.target);
  if (target.hasClass('-disabled')) {
    AlertMessage.remainingVotesError();
    return false;
  }
  Tabs.previous(target);
});

$('.JS-tab-item').click(function(event) {
  var target = $(event.target);
  if (target.hasClass('-active')) {
    return false;
  } else if (target.hasClass('-disabled')) {
    AlertMessage.remainingVotesError();
    return false;
  } else {
    var groupId = target.data('groupId');
    var activeGroup = target.siblings('.JS-tab-item.-active').first();
    Tabs.changeActiveGroupTo(activeGroup.data('groupId'), groupId);
  }
});

if ($('.JS-remaining-votes').length) {
  var remainingVotesOffset = $('.JS-remaining-votes').offset().top;
} else {
  var remainingVotesOffset = 0;
}

$(window).scroll(function(event) {
  Scroll.themeNavigation();
  if ($('.JS-remaining-votes').length) {
    var navigation = $('.JS-tab-navigation');
    var remainingVotes = $('.JS-remaining-votes');
    var margin = parseInt(remainingVotes.css('margin-top'));
    var height = remainingVotesOffset - margin - navigation.outerHeight();
    if ($(document).scrollTop() >= height) {
      remainingVotes.addClass('-fixed');
      remainingVotes.attr('style', 'top: ' + navigation.outerHeight() + 'px');
    } else {
      remainingVotes.removeClass('-fixed');
      remainingVotes.removeAttr('style');
    }
  }
});

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
      window.onbeforeunload = null;
      window.location.href = window.location.href;
    },
    error: function(data) {
      alert(data.responseJSON.message);
    }
  })

  return false;
})

var hideTutorial = Cookie.read('hideTutorial');
if (!hideTutorial || hideTutorial == 'false') {
  $('.JS-modal').addClass('-show');
  $('.JS-help-button').addClass('-active');
}

$('.JS-help-button').click(function(event) {
  $(this).addClass('-active');
  $('.JS-tutorial.-active').removeClass('-active');
  $('.JS-modal').find('.JS-tutorial').first().addClass('-active');
  $('.JS-modal').addClass('-show');
});

$('.JS-modal-next').click(function(event) {
  var target = $(event.target);
  var tutorial = target.closest('.JS-tutorial');
  tutorial.removeClass('-active');
  var next = tutorial.next('.JS-tutorial');
  next.addClass('-active');
});

$('.JS-modal-close').click(function(event) {
  var target = $(event.target);
  target.closest('.JS-modal').removeClass('-show');
  $('.JS-help-button').removeClass('-active');
  Cookie.create('hideTutorial', true);
});

$('.JS-navigation-btn').click(function(event) {
  var target = $(event.target);
  var btn = target.find('.JS-prev-group-btn,.JS-next-group-btn');
  if (btn.hasClass('-disabled')) {
    AlertMessage.remainingVotesError();
  }
});

$('.JS-share-lnk').click(function(event) {
  Share.results(event.target);
});

$('.JS-alert-close').click(function(event) {
  AlertMessage.hide();
});

window.onbeforeunload = function(e) {
  if ($('.JS-vote-input:checked').length) {
    var confirmationMessage = 'Ao deixar a página você perderá todos os seus votos. ' +
                              'Tem certeza que quer sair?';
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }
};