function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
window.addEventListener('load', async () => {
	const bookmarkBtn = document.querySelector('.post_btnReact .btn.bookmark');
	const postEl = document.querySelector('.jona_animeinfo .item-post');
	
	if(bookmarkBtn && postEl) {
		let postId = postEl.getAttribute('post-id');
		let bookmarks = getCookie('bookmarks');
		let currentCookie = !bookmarks ? [] : JSON.parse(bookmarks);
		let hasId = currentCookie.indexOf(postId);
		
		/* [ Check Cookies ] */
		let title = bookmarkBtn.querySelector('span');
		if(hasId === -1) {
			bookmarkBtn.classList.remove('enabled');
			title.textContent = 'Bookmark';
		} else {
			bookmarkBtn.classList.add('enabled');
			title.textContent = 'Bookmarked';
		}
		
		/* [ Btn Cookies ] */
		bookmarkBtn.onclick = () => {
			postId = postEl.getAttribute('post-id');
			bookmarks = getCookie('bookmarks');
			currentCookie = !bookmarks ? [] : JSON.parse(bookmarks);
			hasId = currentCookie.indexOf(postId);
			if(hasId === -1) {
				currentCookie.push(postId);
				bookmarkBtn.classList.add('enabled');
				title.textContent = 'Bookmarked';
			} else {
				currentCookie.splice(hasId, 1);
				bookmarkBtn.classList.remove('enabled');
				title.textContent = 'Bookmark';
			}
			setCookie('bookmarks', JSON.stringify(currentCookie), 360);
		}
	}
	
	/* [ List Bookmarked ] */
	const bookmarkList = document.querySelector('.bookmarkList');
	let bookmarks = getCookie('bookmarks');
	let currentCookie = !bookmarks ? [] : JSON.parse(bookmarks);
	if(bookmarkList) {
		if(currentCookie.length > 0) {
			for(id of currentCookie) {
				let getData = await fetch(`/feeds/posts/default/${id}?alt=json`);
				let json = await getData.json();
				let list = document.createElement('div');
				bookmarkList.appendChild(list);
				console.log(json);
			}
		}
	}
});
