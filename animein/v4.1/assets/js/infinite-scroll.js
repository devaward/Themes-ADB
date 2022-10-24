! function(e, t) {
	e.InfiniteScroll = function(n) {
		function a(e, n) {
			return (n = n || t).querySelectorAll(e)
		}

		function r(e) {
			return void 0 !== e
		}

		function o(e) {
			return "function" == typeof e
		}

		function s(e, t) {
			if (r(c[e]))
				for (var n in c[e]) c[e][n](t)
		}

		function i() {
			return v.innerHTML = d.text.loading, g = !0, T ? (H.classList.add(d.state.loading), s("loading", [d]), void p(T, (function(e, n) {
				H.className = x + " " + d.state.load, (f = t.createElement("div")).innerHTML = e;
				var r = a("title", f),
					o = a(d.target.post, f),
					i = a(d.target.anchors + " " + d.target.anchor, f),
					c = a(d.target.post, h);
				if (r = r && r[0] ? r[0].innerHTML : "", o.length && c.length) {
					var p = c[c.length - 1];
					t.title = r, p.insertAdjacentHTML("afterend", '<span class="fi" id="#fi:' + j + '"></span>'), f = t.createElement("div");
					for (var u = 0, L = o.length; L > u; ++u) f.appendChild(o[u]);
					p.insertAdjacentHTML("afterend", f.innerHTML), l(), T = !!i.length && i[0].href, g = !1, j++, s("load", [d, e, n])
				} else H.classList.add(d.state.loaded), v.innerHTML = d.text.loaded, s("loaded", [d])
			}), (function(e, t) {
				H.classList.add(d.state.error), g = !1, l(1), s("error", [d, e, t])
			}))) : (H.classList.add(d.state.loaded), v.innerHTML = d.text.loaded, s("loaded", [d]))
		}

		function l(e) {
			if (v.innerHTML = "", u) {
				f.innerHTML = d.text[e ? "error" : "load"];
				var t = f.firstChild;
				t.onclick = function() {
					return 2 === d.type && (u = !1), i(), !1
				}, v.appendChild(t)
			}
		}
		var d = {
				target: {
					posts: ".posts",
					post: ".post",
					anchors: ".anchors",
					anchor: ".anchor"
				},
				text: {
					load: "%s",
					loading: "%s",
					loaded: "%s",
					error: "%s"
				},
				state: {
					load: (p = "infinite-scroll-state-") + "load",
					loading: p + "loading",
					loaded: p + "loaded",
					error: p + "error"
				}
			},
			c = {
				load: [],
				loading: [],
				loaded: [],
				error: []
			};
		d = function e(t, n) {
			for (var a in t = t || {}, n) t[a] = "object" == typeof n[a] ? e(t[a], n[a]) : n[a];
			return t
		}(d, n || {}), d.on = function(e, t, n) {
			return r(e) ? r(t) ? void(r(n) ? c[e][n] = t : c[e].push(t)) : c[e] : c
		}, d.off = function(e, t) {
			r(t) ? delete c[e][t] : c[e] = []
		};
		var f = null,
			p = function(t, n, a) {
				if (e.XMLHttpRequest) {
					var r = new XMLHttpRequest;
					r.onreadystatechange = function() {
						if (4 === r.readyState) {
							if (200 !== r.status) return void(a && o(a) && a(r.responseText, r));
							n && o(n) && n(r.responseText, r)
						}
					}, r.open("GET", t), r.send()
				}
			},
			u = 1 !== d.type,
			g = !1,
			h = a(d.target.posts)[0],
			v = a(d.target.anchors)[0],
			T = a(d.target.anchor, v),
			L = t.body,
			H = t.documentElement,
			x = H.className || "",
			M = h.offsetTop + h.offsetHeight,
			w = e.innerHeight,
			m = 0,
			y = null,
			j = 1;
		if (T.length) {
			T = T[0].href, h.insertAdjacentHTML("afterbegin", '<span class="fi" id="#fi:0"></span>'), f = t.createElement("div"), l();
			var E = function() {
				M = h.offsetTop + h.offsetHeight, w = e.innerHeight, m = L.scrollTop || H.scrollTop, g || M > m + w || i()
			};
			E(), 0 !== d.type && e.addEventListener("scroll", (function() {
				u || (y && e.clearTimeout(y), y = e.setTimeout(E, 500))
			}), !1)
		}
		return d
	}
}(window, document);
var infinite_scroll = new InfiniteScroll({
	type: 1,
	target: {
		posts: ".index-post-wrap",
		post: ".index-post",
		anchors: ".blog-pager",
		anchor: ".blog-pager-older-link"
	},
	text: {
		load: '<a class="js-load" href="javascript:;">Muat Lagi</a>',
		loading: '<span class="js-loading" style="cursor:wait;"><svg class="spinner" width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg></span>',
		loaded: '<span class="js-loaded">Anda Mencapai halaman terakhir.</span>',
		error: '<a class="js-error" href="javascript:;">Kesalahan.</a>'
	}
});
