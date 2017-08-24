var alertMessage = $('.JS-alert-message');

var AlertMessage = {
  hide: function() {
    alertMessage.removeClass('-show -error -success');
    alertMessage.find('.JS-alert-text').text('');
  },

  show: function(text) {
    alertMessage.addClass('-show');
    alertMessage.find('.JS-alert-text').text(text);
    setTimeout.clearAll();
    setTimeout(function() {
      AlertMessage.hide();
    }, 7500);
  },

  error: function(text) {
    alertMessage.removeClass('-success');
    alertMessage.addClass('-error');
    this.show(text);
  },

  success: function(text) {
    alertMessage.removeClass('-error');
    alertMessage.addClass('-success');
    this.show(text);
  },

  remainingVotesError: function() {
    this.error('Para votar contra um projeto, você precisa votar a favor de outros dois do mesmo tema.');
  },

  tutorial: function(voteType, unvote, groupId) {
    var remainingUpvotes = Votes.remainingVotes('upvote', groupId);
    var remainingDownvotes = Votes.remainingVotes('downvote', groupId);

    if (unvote) {
      this.hide();
      if (remainingUpvotes <= 2 && remainingDownvotes === 0) {
        this.remainingVotesError();
      }
      return false;
    }

    if (remainingUpvotes === 0 && remainingDownvotes === 0) {
      this.success('Você já usou todos os seus votos neste tema. Vá para o próximo.');
    } else if (voteType === 'downvote' && remainingUpvotes === 1) {
      this.remainingVotesError();
    } else if (voteType === 'upvote' && remainingUpvotes === 1 && remainingDownvotes === 0) {
      this.remainingVotesError();
    } else if (voteType === 'downvote' && remainingUpvotes === 2) {
      this.remainingVotesError();
    } else if (voteType === 'upvote' && remainingUpvotes === 0) {
      this.success('Você usou todos os seus votos a favor. Se quiser, ainda pode usar um voto contrário neste mesmo tema.');
    } else if (voteType === 'downvote') {
      this.remainingVotesError();
    } else {
      this.success('Se quiser, você pode votar a favor de mais um projeto neste tema. Se não, avance para o próximo tema.');
    }
  }
}