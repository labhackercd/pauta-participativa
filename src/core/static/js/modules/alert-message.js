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
    }, 6500);
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
    this.error('Se você quer retriar da pauta um projeto deste tema, você precisa incluir outros dois no mesmo tema');
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
      this.success('Você já usou todos os seus votos neste tema, se não quiser alterar nenhum vá para o próximo tema');
    } else if (voteType === 'downvote' && remainingUpvotes === 1) {
      this.remainingVotesError();
    } else if (voteType === 'upvote' && remainingUpvotes === 1 && remainingDownvotes === 0) {
      this.remainingVotesError();
    } else if (voteType === 'downvote' && remainingUpvotes === 2) {
      this.remainingVotesError();
    } else if (voteType === 'upvote' && remainingUpvotes === 0) {
      this.success('Você já usou seus votos positivos, se quiser ainda pode usar um voto negativo neste tema');
    } else if (voteType === 'downvote') {
      this.remainingVotesError();
    } else {
      this.success('Você ainda pode votar a favor de um projeto neste tema, ou avançar para o póximo');
    }
  }
}