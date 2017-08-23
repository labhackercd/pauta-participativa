var Buttons = {
  changeButtonsState: function(checkbox, groupId) {
    var nextButton = checkbox.closest('.JS-group').find('.JS-next-group-btn');
    var prevButton = checkbox.closest('.JS-group').find('.JS-prev-group-btn');
    var voteType = Votes.getVoteType(checkbox);
    var downvoteNotAvailable = !Votes.downvoteIsAvailable(groupId);
    var unvote = !checkbox.prop('checked');
    var remainingDownvotes = Votes.remainingVotes('downvote', groupId);
    var remainingUpvotes = Votes.remainingVotes('upvote', groupId);

    if (voteType === 'downvote' && downvoteNotAvailable && !unvote) {
      nextButton.addClass('-disabled');
      nextButton.text('Próximo tema');
      prevButton.addClass('-disabled');
      Tabs.disableAllUnless(groupId);
      AlertMessage.tutorial(voteType, unvote, groupId);
    } else if (remainingDownvotes === 0 && remainingUpvotes === 0) {
      nextButton.removeClass('-disabled');
      nextButton.text('Próximo tema');
      prevButton.removeClass('-disabled');
      Tabs.enableAll();
      AlertMessage.tutorial(voteType, unvote, groupId);
    } else if (remainingDownvotes === 1 && remainingUpvotes < 2) {
      nextButton.removeClass('-disabled');
      nextButton.text('Próximo tema');
      prevButton.removeClass('-disabled');
      Tabs.enableAll();
      AlertMessage.tutorial(voteType, unvote, groupId);
    } else if (remainingDownvotes === 1 && remainingUpvotes === 2) {
      nextButton.removeClass('-disabled');
      nextButton.text('Pular tema');
      prevButton.removeClass('-disabled');
      Tabs.enableAll();
      AlertMessage.tutorial(voteType, unvote, groupId);
    } else {
      nextButton.addClass('-disabled');
      prevButton.addClass('-disabled');
      Tabs.disableAllUnless(groupId);
      AlertMessage.tutorial(voteType, unvote, groupId);
    }
  },
}
