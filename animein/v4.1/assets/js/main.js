/* <![CDATA[*/
/* [Get Episode terbaru di Homepage] */
let getNewsEpisode = async(el) => {
  let id = el.getAttribute('post-id');
  let current = await fetch(`/feeds/posts/default/?alt=json&max-results=1&q=label:%23${id}`);
  let json = await current.json();
  let {
    entry
  } = json.feed;
  if (typeof entry != "undefined" && entry != null && entry.length != null && entry.length > 0) {
    for (let {
        rel
        , href
      }
      of entry[0].link) {
      if (rel == "alternate") {
        window.location = href;
      }
    }
  } else {
    alert('Episode terbaru tidak ditemukan');
  }
  return false;
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
  registerListener('click', lazy), registerListener('load', lazy), registerListener('scroll', lazy), document.addEventListener('DOMContentLoaded', (function () {
    'use strict';
    for (var e = document.querySelectorAll('a'), t = e.length, n = /firefox|trident/i ['test'](navigator.userAgent) ? document.documentElement : document.body, d = function (e, t, n, d) {
        return (e /= d / 2) < 1 ? n / 2 * e * e * e + t : n / 2 * ((e -= 2) * e * e + 2) + t
      }; t--;) e.item(t)
      .addEventListener('click', (function (e) {
        var t, i = n.scrollTop
          , o = document.getElementById(/[^#]+$/ ['exec'](this.href)[0])
          .getBoundingClientRect()
          .top
          , r = n.scrollHeight - window.innerHeight
          , b = r > i + o ? o : r - i
          , c = function (e) {
            var o = e - (t = t || e)
              , r = d(o, i, b, 900);
            n.scrollTop = r, 900 > o && requestAnimationFrame(c)
          };
        requestAnimationFrame(c), e.preventDefault()
      }))
  }));
}
window.addEventListener ? window.addEventListener('load', jonaLazyLoad, false) : window.attachEvent ? window.attachEvent('load', jonaLazyLoad) : window.onload = jonaLazyLoad, window.addEventListener ? window.addEventListener('load', jonaLazyLoad, false) : window.attachEvent ? window.attachEvent('load', jonaLazyLoad) : window.onload = jonaLazyLoad; /* [Pecah JSON] */

let pecahJSON = async() => {
    let interval = setInterval(() => {
      let posts = [...document.querySelectorAll('.blog .l .index-post')];
      for (p of posts) {
        let dataJSON = p.querySelector('.dataJSON')
          .innerHTML;
        let doc = new DOMParser()
          .parseFromString('<div class="data">' + dataJSON + '</div>', "text/xml");
        try {
          let json = JSON.parse(doc.querySelector('.dataJSON')
            .textContent);
          let scoreEl = p.querySelector('.scr');
          let circle = scoreEl.querySelector('.deps_circle');
          let text = scoreEl.querySelector('text.info');
          let ubahPersen = parseFloat(json.score * 10);
          circle.setAttribute('stroke-dasharray', `${ubahPersen}, 100`);
          text.textContent = json.score;
          scoreEl.setAttribute('total-score', json.score);
          p.querySelector('.in span label.type')
            .innerText = json.type;
        } catch (e) {
          /*console.log(`invalid json ${doc.outerHTML}`)*/
        }
      }
      clearInterval(interval);
    }, 500);
    let post_ainfo = document.querySelector('.jona_animeinfo .item-post .dataJSON');
    try {
      let doc = new DOMParser()
        .parseFromString('<div class="data">' + post_ainfo.innerHTML + '</div>', "text/xml");
      let json = JSON.parse(doc.querySelector('.dataJSON')
        .textContent);
      let img = doc.querySelector('.separator a img')
        .getAttribute('src');
      let dimg = document.querySelector('.jona_animeinfo .item-post .info');
      dimg.querySelector('.cover img')
        .style.backgroundImage = `url(${img})`;
      dimg.querySelector('.img img')
        .src = img;
      document.body.classList.add('addPecahJSON');
      await ambil_mal(json.mal_id);
      let postid = document.querySelector('.jona_animeinfo .item-post')
        .getAttribute('post-id');
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
  let doc = new DOMParser()
    .parseFromString('<div class="data">' + animepost.innerHTML + '</div>', "text/xml");
  let {
    streaming
    , download
  } = JSON.parse(doc.querySelector('.dataJSON')
    .textContent);
  let img = doc.querySelector('.separator a img')
    .getAttribute('src');
  let target = document.querySelector('.jona_animepost .content');
  target.querySelector('.cover')
    .setAttribute('data-src', img);
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
        name
        , url
      }
      of streaming) {
      i === 0 ? eliframe.src = url : false;
      let span = document.createElement('span');
      let locspan = document.querySelector('.jona_animepost .content .stream .server_list .list');
      span.textContent = name;
      locspan.appendChild(span);
      span.onclick = () => {
        eliframe.src = url;
        document.querySelector('.jona_animepost .content .stream .server_list')
          .classList.remove('active');
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
      let title = document.querySelector('#breadcrumb .current')
        .textContent;
      tab1.innerHTML = `<div class="dl"><h3>${title}</h3><div class="dl-list"></div></div>`; /* [Show url] */
      let dllist = document.querySelector('.dl .dl-list');
      for ({
          quality
          , name
          , url
        }
        of download) {
        if (!dllist.querySelector(`.list[quality="${quality}"]`)) {
          let list = document.createElement('div');
          let quality_title = document.createElement('b');
          dllist.appendChild(list)
            .appendChild(quality_title);
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
  }
  
  /* [tab animepost] */
  [...document.querySelectorAll('.jona_animepost .content .more .etabs button')].map(t => {
    t.onclick = () => {
      let classTab = t.getAttribute('class');
      [...document.querySelectorAll('.jona_animepost .content .more .etabs button')].map(b => b.classList.remove('active'));
      [...document.querySelectorAll('.jona_animepost .content .more .etabs-list div')].map(b => b.classList.remove('active'));
      document.querySelector(`.jona_animepost .content .more .etabs-list div#${classTab}`)
        .classList.add('active');
      t.classList.add('active');
    }
  });

  /* [Episode List] */
  let jonanime_id = document.querySelector('.jona_animepost').getAttribute('jonanime_id');
  let geteps = `/feeds/posts/default?alt=json-in-script&callback=episodeList_byId&start-index=1&max-results=9999&q=label:${encodeURIComponent(jonanime_id)}`;
  let scripteps = document.createElement('script');
  let episodeList_byId = ({feed}) => {
  	const {entry} = feed;
  	for(e of entry) {
  		console.log(e);
  	}
  }
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
    value: 1
    , symbol: ""
  }, {
    value: 1e3
    , symbol: "k"
  }, {
    value: 1e6
    , symbol: "M"
  }, {
    value: 1e9
    , symbol: "G"
  }, {
    value: 1e12
    , symbol: "T"
  }, {
    value: 1e15
    , symbol: "P"
  }, {
    value: 1e18
    , symbol: "E"
  }];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value)
    .toFixed(digits)
    .replace(rx, "$1") + item.symbol : "0";
}
let ambil_mal = async(id) => {
    let url = `https://api.jikan.moe/v4/anime/${id}`;
    let get = await fetch(url);
    let stat = await fetch(`${url}/statistics`);
    let char = await fetch(`${url}/characters`);
    let json_stat = await stat.json();
    let json_get = await get.json();
    let json_char = await char.json();
    let item = document.querySelector('.item-post');
    let info = item.querySelector('.info');
    item.querySelector('.js-loading').remove();

    /* [Statistik Skor] */
    let score = document.createElement('div');
    score.classList.add('score');
    score.innerHTML = `<span class='title'>Score</span><div class="score_"><div class="info"><div class="star"><svg xmlns="http://www.w3.org/2000/svg" width="6rem" height="6rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><label>${json_get.data.score}</label></div> ${Object.keys(json_stat.data).map(k => k !== 'scores' ? `<div class="list"><label>${k.replace(/_/g,' ')}</label><span>${nFormatter(json_stat.data[k], 1)}</span></div>` : '').join('')} </div><div class="stats"><h3>Votes</h3> ${json_stat.data.scores.map(e => `<div class="stat s${e.score}"><span>${e.score}</span><div><span style="width:${e.percentage}%"></span><label>${nFormatter(e.votes, 1)}</label></div></div>`).join('')} </div></div>`;
	info.appendChild(score);
	
	/* [More Info] */
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
			document.querySelector(`.tablist .${id_tab}`).classList.add('active');
			
			/*console.log(tab)*/
		}
	})
	
	/* [Karakter] */
	let list_char = document.createElement('div');
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
			let doc = new DOMParser().parseFromString('<div class="data">' + dataJSON + '</div>', "text/xml");
                        if (doc.querySelector('.dataJSON')) {
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
}
/*]]> */
