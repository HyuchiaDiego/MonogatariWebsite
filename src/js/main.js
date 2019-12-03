import { $_ready, $_, Platform } from '@aegis-framework/artemis';

// Register the service worker
if (Platform.serviceWorkers ()) {
	navigator.serviceWorker.register ('service-worker' + '.js');
}

let tags = [];

const query = window.location.search.replace ('?').split ('&').map ((s) => {
	const [name, value] = s.split ('=');
	return { name, value };
});

$_ready (() => {

	$_('.mailto').each ((element) => {
		const mail = element.href.replace (/\(dot\)/g, '.').replace (/\(at\)/g, '@').replace (window.location.href.replace (window.location.hash, ''), '');
		element.href =  `mailto:${mail}`;
		$_(element).find ('span').text (mail);
	});

	$_('.nav__menu-icon').click (function () {
		$_(this).closest ('ul').toggleClass ('nav__content-list--active');
	});

	$_('.nav__content-list__item').click (function () {
		if ($_(this).closest ('ul').hasClass ('nav__content-list--active')) {
			$_(this).closest ('ul').toggleClass ('nav__content-list--active');
		}
	});

	$_('.donate').click (() => {
		$_('.hidden form').get (0).submit ();
	});

	function filter (value) {
		$_('.game').each ((element) => {
			const text = $_(element).text ().toLowerCase ();
			const containsTags = tags.map (tag => text.indexOf (tag) > -1).findIndex (v => v === false);

			if (text.indexOf (value) > -1 && (containsTags === -1 || tags.length === 0)) {
				$_(element).show ('flex');
			} else {
				$_(element).hide ();
			}
		});
	}

	if (window.location.search.indexOf ('tags')) {
		//console.log (filter);
		// tags = query.filter (s => s.name === 'tags').value.split ('+');
		// filter ();
	}


	$_('[data-content="game-gallery"]').on ('click', '[data-tag], [data-tag] *', function () {
		const tag = $_(this).closest ('[data-tag]').data ('tag');

		if (tags.indexOf (tag) > -1) {
			$_(`[data-tag="${tag}"]`).removeClass ('active');
			$_(`[data-content="active-tags"] [data-tag="${tag}"]`).remove ();
			tags = tags.filter ((t) => t !== tag);

		} else {
			$_(`[data-tag="${tag}"]`).addClass ('active');
			tags.push (tag);
			$_('[data-content="active-tags"]').append (`<button class="tag active" data-tag="${tag}"><span class="fas fa-times"></span> <span>${tag}</span></button>`);
		}
		filter ($_('.search').value ().toLowerCase ());

		// if (tags.length > 0) {
		// 	window.location.search = Request.serialize ({
		// 		tags: tags.join ('+')
		// 	});
		// }
	});

	$_('.search').keyup (function () {
		const value = $_('.search').value ().toLowerCase ();
		filter (value);
	});

});