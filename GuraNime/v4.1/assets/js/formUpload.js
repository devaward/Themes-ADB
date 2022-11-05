function kopi(dom) {
    var copyText = dom.value;
    navigator.clipboard.writeText(copyText).then(() => {
        // Alert the user that the action took place.
        // Nobody likes hidden stuff being done under the hood!
        alert("Copied to clipboard");
    });
}
window.addEventListener('load', async() => {
    const btngroup = document.querySelectorAll('.form_upload .btngroup .btn');
    for (b of btngroup) {
        b.addEventListener('click', navclick, false);

        function navclick() {
            let target = this.getAttribute('for');
            document.querySelector('.btngroup button.active').classList.remove('active');
            this.classList.add('active');
            document.querySelector('.form_upload .show').classList.remove('show');
            document.querySelector('.' + target).classList.add('show');
        }
    }
    const clickInfo = document.querySelector('#injectInfo');
    clickInfo.onclick = async() => {
            const p = '.form_upload';
            const aninfo = document.querySelector(p + ' .aninfo');
            const postTitle = aninfo.querySelector('#title').value;
            const malId = aninfo.querySelector('#mal_id').value;
            const customSynopsis = aninfo.querySelector('#synopsis').value;
            let result = aninfo.querySelector('#resultInfo');
            if (malId) {
                result.innerHTML = 'Loading...';
                const url = 'https://api.jikan.moe/v4/anime/' + malId + '/full';
                const api = await fetch(url);
                const json = await api.json();
                if (json.status !== 404) {
                    const {
                        demographics,
                        images,
                        themes,
                        explicit_genres,
                        genres,
                        score,
                        synopsis,
                        mal_id,
                        title,
                        type
                    } = json.data;
                    const isArray = (arr) => {
                            return Array.isArray(arr) && arr.length ? arr : false;
                        }
                        /* [Results] */
                    let genreWrap = 'animeinfo';
                    isArray(demographics) ? genreWrap = genreWrap + ',' + demographics.map(d => d.name).join(',') : false;
                    isArray(themes) ? genreWrap = genreWrap + ',' + themes.map(d => d.name).join(',') : false;
                    isArray(explicit_genres) ? genreWrap = genreWrap + ',' + explicit_genres.map(d => d.name).join(',') : false;
                    isArray(genres) ? genreWrap = genreWrap + ',' + genres.map(d => d.name).join(',') : false;
                    let object = {
                        title: title,
                        mal_id: mal_id,
                        score: score,
                        synopsis: customSynopsis ? customSynopsis : synopsis,
                        type: type
                    }
                    let compose = `
				
				
								<div class="separator" style="clear: both;">
									<a href="${images.webp.large_image_url}" style="display: block; padding: 1em 0; text-align: center; ">
										<img alt="${title}" border="0" data-original-height="450" data-original-width="322" src="${images.webp.large_image_url}"/>
									</a>
								</div>
								<div class="dataJSON">${JSON.stringify(object)}</div>`;
                    result.innerHTML = `
				
				
								<div class="titleRes">
									<label>Yang ini copas di title</label>
									<input type="text" value="${postTitle?postTitle:title}" readonly/>
									<button class="copyTitle" onclick="kopi(document.querySelector('.titleRes input'))">Copy</button>
								</div>
								<div class="composeRes">
									<label>yang ini copas di bagian content (compose)</label>
									<textarea readonly>${compose}</textarea>
									<button class="copyCompose" onclick="kopi(document.querySelector('.composeRes textarea'))">Copy</button>
								</div>
								<div class="genresRes">
									<label>Kalau yang ini copas di label</label>
									<input readonly value="${genreWrap}"/>
									<button class="copyGenres" onclick="kopi(document.querySelector('.genresRes input'))">Copy</button>
								</div>`;
                } else {
                    result.innerHTML = `Mal ID 
				
								<b>${malId}</b> Tidak ditemukan, Pastikan anda mengisi form dengan benar.`;
                }
            } else {
                alert('Masukkan Mal ID ajg');
            }
        }
        /* [Anime Stream] */
    let streams = document.querySelector('.datastream .streams');
    let download = document.querySelector('.datastream .download');
    streams.querySelector('.addStream').onclick = () => {
        let clone = streams.querySelector('.str').cloneNode(true);
        let close = document.createElement('button');
        clone.appendChild(close).textContent = 'close';
        [...clone.querySelectorAll('input')].map(el => el.value = '');
        streams.insertBefore(clone, streams.lastElementChild);
        close.onclick = () => {
            clone.remove();
        }
    }
    download.querySelector('.addDl').onclick = () => {
        let clone = download.querySelector('.dl').cloneNode(true);
        let close = document.createElement('button');
        clone.appendChild(close).textContent = 'close';
        [...clone.querySelectorAll('input')].map(el => el.value = '');
        download.insertBefore(clone, download.lastElementChild);
        close.onclick = () => {
            clone.remove();
        }
    }
    let url = '/feeds/posts/default/?alt=json&q=label:animeinfo';
    let response = document.querySelector('.anistream .animeinfo .response');
    let clickRes = (el) => {
        el.onclick = () => {
            let datastream = streams.parentNode;
            datastream.classList.add('show');
            el.parentNode.parentNode.classList.remove('show');
            datastream.setAttribute('id', el.getAttribute('id'));
            datastream.querySelector('#selectedTitle').innerHTML = `Anime yang di pilih : 
			
								<b>${el.querySelector('.title').textContent}</b>`;
        }
    }
    const clickSearch = document.querySelector('.anistream .animeinfo .cari_animeinfo');
    const animeResp = async(max) => {
        const jsonStream = await fetch(url + '&max-results=' + max);
        const {
            feed
        } = await jsonStream.json();
        const {
            entry
        } = feed;
        if (entry) {
            let reshtml = [];
            for (e of entry) {
                const {
                    link,
                    title,
                    category
                } = e;
                const cat = category.map(d => d.term);
                if (cat.indexOf('animeinfo') !== -1) {
                    reshtml.push(`
					
					
								<div class="res" id='#${link.map(el => el.rel === 'self' ? el.href : '').join('').split('/').pop()}'>
									<div class="title">${title['$t']}</div>
									<div class="cat">${cat.join(', ')}</div>
								</div>`);
                }
            }
            return reshtml.length >= 1 ? reshtml.join('') : 'Tidak ditemukan';
        } else {
            return 'Tidak ditemukan';
        }
    }
    clickSearch.onclick = async() => {
        let value = clickSearch.parentNode.querySelector('input').value;
        url = '/feeds/posts/default/?alt=json&q=' + value;
        response.innerText = 'Loading...';
        response.innerHTML = await animeResp(500);
        [...response.querySelectorAll('.res')].map(el => clickRes(el));
    }
    response.innerText = 'Loading...';
    response.innerHTML = await animeResp(10);
    [...response.querySelectorAll('.res')].map(el => clickRes(el));
    document.querySelector('.anistream #injectStream').onclick = () => {
        let datastr = document.querySelector('.anistream .datastream');
        let anime_id = datastr.getAttribute('id');
        let eps = datastr.querySelector('.eps input').value;
        let duration = datastr.querySelector('.duration input').value;
        let poster = datastr.querySelector('.poster input').value;
        let streams = datastr.querySelector('.streams');
        let download = datastr.querySelector('.download');
        if (eps && duration && poster) {
            let json = {
                duration: duration,
                streaming: [],
                download: []
            };
            [...streams.querySelectorAll('.str')].map(el => {
                json.streaming.push({
                    name: el.querySelector('input[name="nama"]').value,
                    url: el.querySelector('input[name="url"]').value
                });
            });
            [...download.querySelectorAll('.dl')].map(el => {
                json.download.push({
                    name: el.querySelector('input[name="nama"]').value,
                    url: el.querySelector('input[name="url"]').value
                });
            });
            let html = `
								<div class="separator" style="clear: both;">
									<a
	href="${poster}"
	style="display: block; padding: 1em 0; text-align: center; ">
										<img
		alt=""
		border="0"
		width="200"
		data-original-height="282"
		data-original-width="500" 
		src="${poster}"/>
									</a>
								</div>
								<div class="dataJSON">${JSON.stringify(json)}</div>`;
            let label = `animepost, Episode ${eps !== -1 ? eps : 'Movie'}, ${anime_id}`;
            datastr.querySelector('#resultStream').innerHTML = `
								<div class="result">
									<div class="labelresstr">
										<label>Copas di Label</label>
										<input readonly value='${label}'/>
										<button onclick="kopi(document.querySelector('#resultStream .result .labelresstr input'))">Copy</button>
									</div>
									<div class="contentresstr">
										<label>Copas di Content</label>
										<textarea readonly>${html}</textarea>
										<button onclick="kopi(document.querySelector('#resultStream .result .contentresstr textarea'))">Copy</button>
									</div>
								</div>
			`;
        } else {
            alert('Lengkapi Form yang belum di isi.')
        }
    }
});
