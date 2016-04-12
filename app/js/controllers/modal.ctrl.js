angular.module('app').controller('ModalCtrl', function ModalCtrl() {
	$('body').removeClass('pt-hover');

	if ($('#disqus_thread').html() === '') {
		window.disqus_config = function () {
			this.language = 'de';
			this.page.url = 'http://frieden-illnau.ch/restaurant-frieden-illnau-gaestebuch.html';
			this.page.title = 'Restaurant Frieden Illnau';
		};
		/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
		var disqus_shortname = 'frieden-illnau'; // required: replace example with your forum shortname

		/* * * DON'T EDIT BELOW THIS LINE * * */
		(function() {
			var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
			dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		})();
	}
});
