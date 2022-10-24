/* <![CDATA[*/ /* [Get Episode terbaru di Homepage] */
let getNewsEpisode = async (el) => {
	let id = el.getAttribute('post-id');
	let current = await fetch(`/feeds/posts/default/?alt=json&max-results=1&q=label:%23${id}`);
	let json = await current.json();
	let {
		entry
	} = json.feed;
	if (typeof entry != "undefined" && entry != null && entry.length != null && entry.length > 0) {
		for (let {
				rel,
				href
			} of entry[0].link) {
			if (rel == "alternate") {
				window.location = href;
			}
		}
	} else {
		alert('Episode terbaru tidak ditemukan');
	}
	return false;
}
let episodelist = (a) => {
	console.log(a);
}

/* [LazyLoad] */
function jonaLazyLoad() {
	function lazy() {
		for (var e = document.getElementsByClassName("lazy"), t = 0; t < e.length; t++) isInViewport(e[t]) && (e[t].src = e[t].getAttribute("data-src"));
		for (var e = document.getElementsByClassName("lazy-bg"), t = 0; t < e.length; t++) isInViewport(e[t]) && (e[t].style.backgroundImage = `url(${e[t].getAttribute("data-src")})`);
		isInViewport(document.body) && document.body.classList.contains('addPecahJSON') !== true ? pecahJSON() : false;
		document.querySelector('#HTML1 .episodebaru .daftar_episode') && document.body.classList.contains('addPerEpisode') !== true ? perEpisode() : false;
	}

	function isInViewport(e) {
		var t = e.getBoundingClientRect();
		return t.bottom >= 0 && t.right >= 0 && t.top <= (window.innerHeight || document.documentElement.clientHeight) && t.left <= (window.innerWidth || document.documentElement.clientWidth)
	}

	function registerListener(e, t) {
		window.addEventListener ? window.addEventListener(e, t) : window.attachEvent('on' + e, t)
	}
	registerListener('click', lazy), registerListener('load', lazy), registerListener('scroll', lazy), document.addEventListener('DOMContentLoaded', (function() {
		'use strict';
		for (var e = document.querySelectorAll('a'), t = e.length, n = /firefox|trident/i ['test'](navigator.userAgent) ? document.documentElement : document.body, d = function(e, t, n, d) {
				return (e /= d / 2) < 1 ? n / 2 * e * e * e + t : n / 2 * ((e -= 2) * e * e + 2) + t
			}; t--;) e.item(t).addEventListener('click', (function(e) {
			var t, i = n.scrollTop,
				o = document.getElementById(/[^#]+$/ ['exec'](this.href)[0]).getBoundingClientRect().top,
				r = n.scrollHeight - window.innerHeight,
				b = r > i + o ? o : r - i,
				c = function(e) {
					var o = e - (t = t || e),
						r = d(o, i, b, 900);
					n.scrollTop = r, 900 > o && requestAnimationFrame(c)
				};
			requestAnimationFrame(c), e.preventDefault()
		}))
	}));
}
window.addEventListener ? window.addEventListener('load', jonaLazyLoad, false) : window.attachEvent ? window.attachEvent('load', jonaLazyLoad) : window.onload = jonaLazyLoad, window.addEventListener ? window.addEventListener('load', jonaLazyLoad, false) : window.attachEvent ? window.attachEvent('load', jonaLazyLoad) : window.onload = jonaLazyLoad; /* [Pecah JSON] */
let pecahJSON = async () => {
	let interval = setInterval(() => {
		let posts = [...document.querySelectorAll('.blog .l .index-post')];
		for (p of posts) {
			let dataJSON = p.querySelector('.dataJSON').innerHTML;
			let doc = new DOMParser().parseFromString('<div class="data">' + dataJSON + '</div>', "text/xml");
			try {
				let json = JSON.parse(doc.querySelector('.dataJSON').textContent);
				let scoreEl = p.querySelector('.scr');
				let circle = scoreEl.querySelector('.deps_circle');
				let text = scoreEl.querySelector('text.info');
				let ubahPersen = parseFloat(json.score * 10);
				circle.setAttribute('stroke-dasharray', `${ubahPersen}, 100`);
				text.textContent = json.score;
				scoreEl.setAttribute('total-score', json.score);
				p.querySelector('.in span label.type').innerText = json.type;
			} catch (e) {
				/*console.log(`invalid json ${doc.outerHTML}`)*/
			}
		}
		clearInterval(interval);
	}, 500);
	let post_ainfo = document.querySelector('.jona_animeinfo .item-post .dataJSON');
	try {
		let doc = new DOMParser().parseFromString('<div class="data">' + post_ainfo.innerHTML + '</div>', "text/xml") let json = JSON.parse(doc.querySelector('.dataJSON').textContent);
		let img = doc.querySelector('.separator a img').getAttribute('src');
		let dimg = document.querySelector('.jona_animeinfo .item-post .info');
		dimg.querySelector('.cover img').style.backgroundImage = `url(${img})`;
		dimg.querySelector('.img img').src = img;
		document.body.classList.add('addPecahJSON');
		await ambil_mal(json.mal_id);
		let postid = document.querySelector('.jona_animeinfo .item-post').getAttribute('post-id');
		if (postid) {
			let urlku = new URL(`${window.location.origin}/feeds/posts/default/?alt=json-in-script&callback=episode_perid&max-results=9999&q=label:%23${postid}`);
			let scr_ep = document.createElement('script');
			scr_ep.setAttribute('defer', '');
			scr_ep.src = urlku;
			document.body.appendChild(scr_ep);
			scr_ep.onload = () => {
				scr_ep.remove();
			}
		} else {
			/*console.log('ID untuk mengambil daftar Episode Gaada');*/
		}
	} catch (e) {
		/*console.log(`Invalid JSON Anime Info`);*/
	}
}
/* [Anime Post] */
let animepost = document.querySelector('.jona_animepost .item-post .dataJSON');
try {
	let doc = new DOMParser().parseFromString('<div class="data">' + animepost.innerHTML + '</div>', "text/xml") let {
		streaming,
		download
	} = JSON.parse(doc.querySelector('.dataJSON').textContent);
	let img = doc.querySelector('.separator a img').getAttribute('src');
	let target = document.querySelector('.jona_animepost .content');
	target.querySelector('.cover').setAttribute('data-src', img);
	let loc_iframe = document.querySelector('.jona_animepost .content .stream');
	let loading = loc_iframe.querySelector('.loading');
	let tabs = document.querySelector('.jona_animepost .etabs-list'); /* [streaming] */
	if (streaming) {
		let i = 0;
		let iframe = document.createElement('iframe');
		loc_iframe.appendChild(iframe);
		iframe.setAttribute('allowfullscreen', 'allowfullscreen');
		let eliframe = loc_iframe.querySelector('iframe');
		eliframe.onload = () => {
			loading.classList.remove('active');
		}
		let server_list = document.querySelector('.jona_animepost .content .stream .server_list .icon');
		server_list.onclick = () => {
			let check = server_list.parentNode.classList;
			if (check.contains('active') !== true) {
				check.add('active');
			} else {
				check.remove('active');
			}
		}
		for (let {
				name,
				url
			} of streaming) {
			i === 0 ? eliframe.src = url : false;
			let span = document.createElement('span');
			let locspan = document.querySelector('.jona_animepost .content .stream .server_list .list');
			span.textContent = name;
			locspan.appendChild(span);
			span.onclick = () => {
				eliframe.src = url;
				document.querySelector('.jona_animepost .content .stream .server_list').classList.remove('active');
				loading.classList.add('active');
				eliframe.onload = () => {
					loading.classList.remove('active');
				}
			}
			i++;
		}
	} else {
		let spanError = document.createElement('span');
		loading.classList.remove('active');
		loc_iframe.appendChild(spanError);
		spanError.classList.add('error');
		spanError.innerText = 'Server Streaming tidak tersedia';
	} /* [download] */
	let tab1 = tabs.querySelector('#tab1');
	if (download) {
		if (download.length > 0) {
			/* [Element DL] */
			let title = document.querySelector('#breadcrumb .current').textContent;
			tab1.innerHTML = `<div class="dl"><h3>${title}</h3><div class="dl-list"></div></div>`; /* [Show url] */
			let dllist = document.querySelector('.dl .dl-list');
			for ({
					quality,
					name,
					url
				} of download) {
				if (!dllist.querySelector(`.list[quality="${quality}"]`)) {
					let list = document.createElement('div');
					let quality_title = document.createElement('b');
					dllist.appendChild(list).appendChild(quality_title);
					list.classList.add('list');
					list.setAttribute('quality', quality);
					quality_title.textContent = quality;
				}
				let perquality = dllist.querySelector(`.list[quality="${quality}"]`);
				let dl_url = document.createElement('span');
				perquality.appendChild(dl_url);
				dl_url.textContent = name;
				dl_url.onclick = () => {
					window.open(url, '_blank', 'resizable');
				}
			}
		}
	} else {
		let spanError = document.createElement('span');
		spanError.classList.add('error');
		spanError.innerText = 'Server Download tidak tersedia';
		tab1.appendChild(spanError);
	} /* [tab animepost] */ [...document.querySelectorAll('.jona_animepost .content .more .etabs button')].map(t => {
		t.onclick = () => {
			let classTab = t.getAttribute('class');
			[...document.querySelectorAll('.jona_animepost .content .more .etabs button')].map(b => b.classList.remove('active'));
			[...document.querySelectorAll('.jona_animepost .content .more .etabs-list div')].map(b => b.classList.remove('active'));
			document.querySelector(`.jona_animepost .content .more .etabs-list div#${classTab}`).classList.add('active');
			t.classList.add('active');
		}
	}); /* [Episode List] */
	let jonanime_id = document.querySelector('.jona_animepost').getAttribute('jonanime_id');
	let geteps = `/feeds/posts/default?callback=episodelist&alt=json&start-index=1&max-results=9999&q=label:${encodeURIComponent(jonanime_id)}`;
	let scripteps = document.createElement('script');
	scripteps.src = geteps;
	scripteps.type = 'application/javascript';
	document.body.appendChild(scripteps);
	scripteps.onload = () => {
		scripteps.remove()
	};
} catch (e) {
	/*console.log('Error Anime Post : ' + e);*/
}

function nFormatter(num, digits) {
	const lookup = [{
		value: 1,
		symbol: ""
	}, {
		value: 1e3,
		symbol: "k"
	}, {
		value: 1e6,
		symbol: "M"
	}, {
		value: 1e9,
		symbol: "G"
	}, {
		value: 1e12,
		symbol: "T"
	}, {
		value: 1e15,
		symbol: "P"
	}, {
		value: 1e18,
		symbol: "E"
	}];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var item = lookup.slice().reverse().find(function(item) {
		return num >= item.value;
	});
	return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}
let ambil_mal = async (id) => {
	let url = `https://api.jikan.moe/v4/anime/${id}`;
	let get = await fetch(url);
	let stat = await fetch(`${url}/statistics`);
	let char = await fetch(`${url}/characters`);
	let json_stat = await stat.json();
	let json_get = await get.json();
	let json_char = await char.json();
	let item = document.querySelector('.item-post');
	let info = item.querySelector('.info');
	item.querySelector('.js-loading').remove(); /* [Statistik Skor] */
	let score = document.createElement('div');
	score.classList.add('score');
	score.innerHTML = `<span class='title'>Score</span><div class="score_"><div class="info"><div class="star"><svg xmlns="http://www.w3.org/2000/svg" width="6rem" height="6rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><label>${json_get.data.score}</label></div> ${Object.keys(json_stat.data).map(k => k !== 'scores' ? `<div class="list"><label>${k.replace(/_/g,' ')}</label><span>${nFormatter(json_stat.data[k], 1)}</span></div>` : '').join('')} </div><div class="stats"><h3>Votes</h3> ${json_stat.data.scores.map(e => `<div class="stat s${e.score}"><span>${e.score}</span><div><span style="width:${e.percentage}%"></span><label>${nFormatter(e.votes, 1)}</label></div></div>`).join('')} </div></div>`;
	info.appendChild(score); /* [More Info] */
	let more_info = document.createElement('div');
	more_info.classList.add('more_info');
	more_info.innerHTML = `<div class="tabs"><button id="tab1" class="active">Daftar Episode</button><button id="tab2">Info Lainnya</button><button id="tab3">Karakter & Staff</button></div><div class="tablist"><div class="tab tab1 active"></div><div class="tab tab2"></div><div class="tab tab3"></div></div>`;
	await info.appendChild(more_info);
	[...more_info.querySelectorAll('.tabs button')].map(tab => {
		tab.onclick = () => {
			[...document.querySelectorAll('.tabs button')].map(e => e.classList.remove('active'));
			[...document.querySelectorAll('.tablist .tab')].map(e => e.classList.remove('active'));
			let id_tab = tab.getAttribute('id');
			tab.classList.add('active');
			document.querySelector(`.tablist .${id_tab}`).classList.add('active'); /*console.log(tab)*/
		}
	}) /* [Karakter] */ let list_char = document.createElement('div');
	list_char.classList.add('daftar_karakter');
	list_char.innerHTML = `<span class="title">Karakter & Staff</span><div class="karakter_"> ${json_char.data.map(c => `<div class="daftar"><span class="role">${c.role}</span><div class="char"><img src="${c.character.images.jpg.image_url}"/><span>${c.character.name}</span></div><div class="staff"> ${c.voice_actors.map(p => `<div class="person"><img src="${p.person.images.jpg.image_url}"/><span class="lang">${p.language}</span><span class="name">${p.person.name}</span></div>`).join('')} </div></div>`).join('')} </div>`;
	info.querySelector('.tab3').appendChild(list_char);
}
let episode_perid = ({
	feed
}) => {
	let {
		entry
	} = feed;
	if (entry) {
		let show_eps = (e) => {
			let {
				content
			} = e;
			dataJSON = content['$t'];
			let doc = new DOMParser().parseFromString('<div class="data">' + dataJSON + '</div>', "text/xml") if (doc.querySelector('.dataJSON')) {
				try {
					let json = JSON.parse(doc.querySelector('.dataJSON').textContent);
					return `<a href="${e.link.map(link => (link.rel == 'alternate' ? link.href : '')).join('')}">${e.category.map(cat => (cat.term.indexOf('Episode') !== -1 ? cat.term : '')).join('')}<span>${json.duration ? json.duration : '-'}</span></a>`;
				} catch (e) {
					/*console.log('terdeteksi bukan JSON di episode_perid')*/ }
			} else {
				/*console.log('dataJSON di fungsi episode_perid tidak di temukan');*/ }
		}
		document.querySelector('.more_info .tablist .tab.tab1').innerHTML = `<div class="list_eps">${entry.map(e => show_eps(e)).join('')}</div>`;
	} else {
		document.querySelector('.more_info .tablist .tab.tab1').innerHTML = '<div class="err">Belum upload Episode</div>';
	}
} /* [tambah animeinfo] */
let add_anime = form => {
	function fallbackCopyTextToClipboard(e) {
		var o = document.createElement("textarea");
		o.value = e, o.style.top = "0", o.style.left = "0", o.style.position = "fixed", document.body.appendChild(o), o.focus(), o.select();
		try {
			var t = document.execCommand("copy") ? "successful" : "unsuccessful";
			console.log("Fallback: Copying text command was " + t)
		} catch (e) {
			console.error("Fallback: Oops, unable to copy", e)
		}
		document.body.removeChild(o)
	}

	function copyTextToClipboard(e) {
		navigator.clipboard ? navigator.clipboard.writeText(e).then((function() {
			console.log("Async: Copying to clipboard was successful!")
		}), (function(e) {
			console.error("Async: Could not copy text: ", e)
		})) : fallbackCopyTextToClipboard(e)
	}
	return eval(function(e, o, t, x, n, c) {
		if (n = function(e) {
				return (e < 62 ? "" : n(parseInt(e / 62))) + ((e %= 62) > 35 ? String.fromCharCode(e + 29) : e.toString(36))
			}, !"".replace(/^/, String)) {
			for (; t--;) c[n(t)] = x[t] || n(t);
			x = [function(e) {
				return c[e]
			}], n = function() {
				return "\\w+"
			}, t = 1
		}
		for (; t--;) x[t] && (e = e.replace(new RegExp("\\b" + n(t) + "\\b", "g"), x[t]));
		return e
	}("4 0=5;6 7(){4 r=['j','p[8=\\A\\9]','B','C','D','E','k','l\\F','m','n','G','p[8=\\H\\9]','I','J','K','q','L[8=\\M\\9]','N','l\\O','l\\P\\Q','R','S','T\\s\\U,\\V\\W\\s\\X\\Y.','l\\Z','10','11','12'];7=6(){o r};o 7()}6 5(c,d){4 t=7();o 5=6(a,b){a=a-u;v w=t[a];o w},5(c,d)}(6(a,b){4 1=5,e=a();13(!![]){14{4 x=2(1(15))/16*(2(1(17))/18)+-2(1(19))/1a*(2(1(1b))/1c)+-2(1(1d))/1e+2(1(1f))/1g*(-2(1(1h))/1i)+2(1(1j))/1k*(-2(1(1l))/1m)+-2(1(1n))/1o+2(1(1p))/1q;1r(x===b)1s;1t e['y'](e['z']())}1u(1v){e['y'](e['z']())}}}(7,1w));v 3={};m=f[0(g)]('p[8=\\1x\\9]')[0(h)],n=f[0(g)](0(1y))[0(h)],q=f[0(g)](0(1z))[0(h)],j=f[0(g)](0(1A))[0(h)],k=f[0(g)]('1B[8=\\1C\\9]')[0(h)];!m?i(0(1D)):(3[0(u)]=m,!n?i(0(1E)):(3[0(1F)]=n,!j?i(0(1G)):(3[0(1H)]=j,!k?i(0(1I)):(3[0(1J)]=k,3[0(1K)]=q,1L(1M[0(1N)](3)),i(0(1O))))));", 0, 113, "_0x1be78c|_0x19b60f|parseInt|json|const|_0x87f3|function|_0x1cf6|name|x22|||||_0xe6a6d1|form|0x190|0x189|alert|score|synopsis|masukkan|title|mal_id|return|input|type|_0x2ccb6e|x20di|_0x1cf658|0x179|let|_0x701420|_0x48858d|push|shift|x22score|8332qwFSyN|1094430iExLJX|querySelector|84eZtuXP|x20score|36LNqZuy|x22mal|20044SWEpKU|204ywjddj|2115pUNccY|select|x22type|142219okIAGS|x20sinopsis|x20mal|x20id|stringify|42927687cLXiRc|Sudah|x20Copy|x20silahkan|x20tempel|x20postingan|x20blogger|x20title|value|5877730mzBCVP|1120280dogMPu|while|try|0x191|0x1|0x17d|0x2|0x17f|0x3|0x18e|0x4|0x18a|0x5|0x17e|0x6|0x182|0x7|0x18b|0x8|0x17b|0x9|0x18f|0xa|0x186|0xb|if|break|else|catch|_0x3c2d3d|0xb4a67|x22title|0x17c|0x181|0x18d|textarea|x22sinopsis|0x188|0x184|0x17a|0x193|0x18c|0x183|0x192|0x180|copyTextToClipboard|JSON|0x185|0x187".split("|"), 0, {})), !1
}; /*]]> */
