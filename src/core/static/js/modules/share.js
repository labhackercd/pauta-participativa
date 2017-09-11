var Share = {
  results: function(shareButton) {
    var socialNetwork = $(shareButton).data('social');
    var agendaUrl =  location.href;

    var windowOptions = 'height=500,width=1000,left=100,top=100,resizable=yes,' +
      'scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes';

    switch (socialNetwork) {
      case 'facebook':
        var facebookUrl = 'http://www.facebook.com/sharer/sharer.php?u=' + agendaUrl;
        window.open(facebookUrl, 'popUpWindow', windowOptions);
        break;
      case 'twitter':
        var twitterUrl = 'http://twitter.com/share?text=Eu já votei. Dê sua opinião também! &url=' + agendaUrl;
        window.open(twitterUrl, 'popUpWindow', windowOptions);
        break;
      case 'whatsapp':
        var whatsappUrl = encodeURIComponent('Eu já votei. Dê sua opinião também! ') + encodeURIComponent(agendaUrl);
        window.open('whatsapp://send?text=' + whatsappUrl, 'popUpWindow', windowOptions);
        break;
      default:
        break;
    }
  }
}