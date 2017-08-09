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

  changeNextButtonState: function(checkbox, groupId) {
    var voteType = this.getVoteType(checkbox);
    var downvoteNotAvailable = !this.downvoteIsAvailable(groupId);
    var unvote = !checkbox.prop('checked');
    var remainingDownvotes = this.remainingVotes('downvote', groupId);
    var remainingUpvotes = this.remainingVotes('upvote', groupId);
    if (voteType === 'downvote' && downvoteNotAvailable && !unvote) {
      alert('avisar sobre ter que gastar todos os votos negativos');
    } else if (remainingDownvotes === 0 && remainingUpvotes === 0) {
      alert('permitir clique depois de votar tudo');
    } else if (remainingDownvotes === 1 && remainingUpvotes < 2) {
      alert('permitir clique');
    } else {
      alert('desabilitar botao');
    }
  },
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
      $(siblingCheckbox).prop('checked', false);
      var siblingType = Votes.getVoteType(siblingCheckbox);
      Votes.incrementCounter(siblingType, groupId);
      Votes.checkUnvoted(siblingType, groupId);
    }
  } else {
    if (Votes.remainingVotes(voteType, groupId)) {
      Votes.decrementCounter(voteType, groupId);
    } else {
      alert('sem votos disponiveis');
      return false;
    }
  }

  Votes.changeNextButtonState(target, groupId);
  Votes.checkUnvoted(voteType, groupId);
})

$('.JS-send-votes').click(function(){
  $('.JS-vote-input:checked').each(function() {
    var title = $(this).closest('.JS-proposal').data('title');
    var vote = $(this).val();
    var groupId = $(this).closest('.JS-group').data('groupId');
    var groupReview = $('.JS-group-review[data-group-id="' + groupId + '"');
    var html = '<li><span>' + vote + '</span><span> ' + title + '</span></li>'
    groupReview.find('.JS-voted-list').append(html);
  });

  var votedLists = $('.JS-voted-list');
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