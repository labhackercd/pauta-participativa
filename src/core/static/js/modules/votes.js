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
    var voteCounter = group.find('.-' + voteType + '.-used.JS-vote-counter').last();
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
    var voteInputs = group.find(selector);
    voteInputs.attr('disabled', true);

    var tickbox = voteInputs.closest('.JS-tickbox');
    tickbox.attr('data-hide-tooltip', false);
    tickbox.tooltip();
  },

  enableUnvoted: function(voteType, groupId) {
    var group = $('.JS-group[data-group-id="' + groupId + '"]');
    var selector = '.JS-vote-input[data-vote-type="' + voteType +
                   '"]:not(:checked)';
    var voteInputs = group.find(selector);
    voteInputs.removeAttr('disabled');

    var tickbox = voteInputs.closest('.JS-tickbox');
    tickbox.attr('data-hide-tooltip', true);
    tickbox.removeTooltip();
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
