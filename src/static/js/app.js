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
    var voteSpan = group.find('.JS-' + voteType + '-counter');
    var count = parseInt(voteSpan.text());
    voteSpan.text(count - 1);
  },

  incrementCounter: function(voteType, groupId) {
    var group = $('.JS-group[data-group-id="' + groupId + '"]');
    var voteSpan = group.find('.JS-' + voteType + '-counter');
    var count = parseInt(voteSpan.text());
    voteSpan.text(count + 1);
  },

  remainingVotes: function(voteType, groupId) {
    var group = $('.JS-group[data-group-id="' + groupId + '"]');
    var voteSpan = group.find('.JS-' + voteType + '-counter');
    return parseInt(voteSpan.text());
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
}


function isVoted(checkbox) {
  if (checkbox.hasClass('voted')) {
    return true;
  } else {
    return false;
  }
}

function isUpvote(btn) {
  return btn.hasClass('upvote');
}

function votesLeft(groupElement) {
  var groupVotes = groupElement.find('.js-vote');
  var votes = $.map(groupVotes, function(vote) {
    var classes = $(vote).attr('class');
    return classes.replace('js-vote', '').trim();
  });
  return votes;
}

function popVote(groupElement) {
  var votesList = groupElement.find('.js-votes-list');
  return votesList.children('.js-vote').first().detach();
}

function replaceVote(groupElement, voteType) {
  var votesList = groupElement.find('.js-votes-list');
  var newElement = $.parseHTML('<li class="js-vote js-' + voteType + '">' + voteType + '</li>');
  votesList.prepend(newElement);
}

function updateInputValue(labelFor, value) {
  var input = $('#' + labelFor);
  if (value) {
    input.val(value);
  } else {
    input.removeAttr('value');
  }
}

$('.JS-vote-input').click(function(event) {
  var target = $(event.target);
  var siblingCheckbox = Votes.siblingCheckbox(target);
  var voteType = Votes.getVoteType(target);
  var groupId = target.closest('.JS-group').data('groupId');

  if (Votes.proposalIsVoted(target, siblingCheckbox)) {
    if (!target.prop('checked')) {
      Votes.incrementCounter(voteType, groupId);
    } else {
      Votes.decrementCounter(voteType, groupId);
      siblingCheckbox.click();
    }
  } else {
    if (Votes.remainingVotes(voteType, groupId)) {
      Votes.decrementCounter(voteType, groupId);
    } else {
      alert('sem votos disponiveis');
      return false;
    }
  }

  if (!Votes.remainingVotes(voteType, groupId)) {
    Votes.disableUnvoted(voteType, groupId);
  } else {
    Votes.enableUnvoted(voteType, groupId);
  }
})

$('.js-next-group').click(function(e) {
  var target = $(e.target);
  var group = target.closest('.js-group');
  var userVotesLeft = votesLeft(group);

  if (userVotesLeft.length === 0 || userVotesLeft.length === 3) {
    alert('Pode ir pro próximo');
  } else {
    alert('Opa! Voce precisa gastar todos os votos')
  }
})

$('.js-send-votes').click(function(){
  $('.js-checkbox:checked').each(function() {
    var title = $(this).closest('.js-proposal').data('title');
    var vote = $(this).val();
    var groupId = $(this).closest('.js-group').data('groupId');
    var groupReview = $('.js-group-review[data-group-id="' + groupId + '"');
    var html = '<li><span>' + vote + '</span><span> ' + title + '</span></li>'
    groupReview.find('.js-voted-list').append(html);
  });

  var votedLists = $('.js-voted-list');
  var votedListsCount = votedLists.length;
  var emptyVoteList = 0;

  votedLists.each(function() {
    var votes = $(this).children();
    if (votes.length === 0) {
      $(this).append('<li>Voto em branco</li>');
      emptyVoteList = emptyVoteList + 1;
    }
  });

  if (votedListsCount === emptyVoteList) {
    alert('Vote em pelo menos um grupo.');
  }
});

$('.js-review-back-btn').click(function() {
  $('.js-voted-list').each(function() {
    $(this).html('');
  });
})

$('.js-submit-votes-form').submit(function(e) {
  var csrftoken = $(this).find('[name="csrfmiddlewaretoken"]').val();
  var recaptchaResponse = $(this).find('[name="g-recaptcha-response"]').val();
  var agendaId = $(this).closest('.js-agenda').data('agendaId');
  // if (!recaptchaResponse) {
  //   alert('Tem que marcar o reCaptcha');
  // }

  var data = {
    recaptchaResponse: recaptchaResponse,
    groups: []
  };

  $('.js-group-form').each(function() {
    var groupId = $(this).closest('.js-group').data('groupId');
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