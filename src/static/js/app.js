
function isVoted(btn) {
  if (btn.hasClass('voted')) {
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

$('.js-vote-checkbox').click(function(e) {
  var target = $(e.target);
  var group = target.closest('.js-group');
  var userVotesLeft = votesLeft(group);

  if (userVotesLeft.length > 0 && !isVoted(target)) {
    var vote = popVote(group);
    if (vote.hasClass('js-upvote')) {
      target.addClass('voted upvote');
      updateInputValue(target.attr('for'), 'upvote');
    } else {
      target.addClass('voted downvote');
      updateInputValue(target.attr('for'), 'downvote');
    }
  } else if(isVoted(target)) {
    if (isUpvote(target)) {
      target.removeClass('upvote');
      replaceVote(group, 'upvote');
      updateInputValue(target.attr('for'), '');
    } else {
      target.removeClass('downvote');
      replaceVote(group, 'downvote');
      updateInputValue(target.attr('for'), '');
    }
    target.removeClass('voted');
  } else if (userVotesLeft.length === 0 && !isVoted(target)) {
    alert('ja gastou todos os votos');
  }
});

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
    url: window.Urls.submit_votes(agendaId),
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