var Buttons = {
  changeButtonsState: function(checkbox, groupId) {
    var nextButton = checkbox.closest('.JS-group').find('.JS-next-group-btn');
    var prevButton = checkbox.closest('.JS-group').find('.JS-prev-group-btn');
    var errorMessage = $('.JS-error-message');
    var voteType = Votes.getVoteType(checkbox);
    var downvoteNotAvailable = !Votes.downvoteIsAvailable(groupId);
    var unvote = !checkbox.prop('checked');
    var remainingDownvotes = Votes.remainingVotes('downvote', groupId);
    var remainingUpvotes = Votes.remainingVotes('upvote', groupId);

    if (voteType === 'downvote' && downvoteNotAvailable && !unvote) {
      nextButton.prop('disabled', true);
      nextButton.text('Próximo');
      prevButton.prop('disabled', true);
      Tabs.disableAllUnless(groupId);
      errorMessage.addClass('-show');
      setTimeout(function() {
        errorMessage.find('.JS-error-close').click();
      }, 6500);
    } else if (remainingDownvotes === 0 && remainingUpvotes === 0) {
      nextButton.prop('disabled', false);
      nextButton.text('Próximo');
      prevButton.prop('disabled', false);
      Tabs.enableAll();
      errorMessage.removeClass('-show');
      errorMessage.find('.JS-error-close').click();
    } else if (remainingDownvotes === 1 && remainingUpvotes < 2) {
      nextButton.prop('disabled', false);
      nextButton.text('Próximo');
      prevButton.prop('disabled', false);
      Tabs.enableAll();
      errorMessage.removeClass('-show');
      errorMessage.find('.JS-error-close').click();
    } else if (remainingDownvotes === 1 && remainingUpvotes === 2) {
      nextButton.prop('disabled', false);
      nextButton.text('Pular');
      prevButton.prop('disabled', false);
      Tabs.enableAll();
      errorMessage.removeClass('-show');
      errorMessage.find('.JS-error-close').click();
    } else {
      nextButton.prop('disabled', true);
      prevButton.prop('disabled', true);
      Tabs.disableAllUnless(groupId);
      errorMessage.addClass('-show');
      setTimeout(function() {
        errorMessage.find('.JS-error-close').click();
      }, 6500);
    }
  },
}
