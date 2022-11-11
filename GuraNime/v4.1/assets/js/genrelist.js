window.addEventListener('load', async () => {
    try {
      /* [Ambil semua genre di blogger] */
      let url_api = 'https://blogger.adb.my.id/';
      let get = await fetch(url_api + 'alat.php?target=' + window.location.hostname + '&action=all_genres');
      let json = await get.json();

      /*[Data Genre Ambil juga]*/
      let genrelist = 'https://themes.adb.my.id/GuraNime/v4.1/assets/json/genrelist.json';
      let get_2 = await fetch(genrelist);
      let json_2 = await get_2.json();

      /* [dom] */
      let genredom = document.querySelector('#jona_genrelist');

      let loop = (data, title) => {
        if(data && data.length > 0) {
          let genres = document.createElement('div');
          let title_g = document.createElement('h3');
          genres.classList.add('genres');
          title_g.innerText = title;
          genredom.appendChild(genres).appendChild(title_g);
          for(let {type, list} of data) {
            let type_g = document.createElement('div');
            let type_title_g = document.createElement('h3');
            let lists_g = document.createElement('div');
            type_title_g.innerText = type;
            type_g.classList.add('type_g');
            type_g.setAttribute('type',type);
            type_g.appendChild(type_title_g);
            type_g.appendChild(lists_g);
            lists_g.classList.add('lists_g');
            genres.appendChild(type_g);

            /* [check] */
            let exists = false;
            let count = 0;
            for(genre of json) {
              count++;
              list.map(e => {
                if(e.label == genre) {
                  exists = true;
                  let list_g = document.createElement('span');
                  lists_g.appendChild(list_g);
                  list_g.innerText = e.title;
                  list_g.onclick = () => {
                    location.replace('/search/label/'+e.label);
                  }
                }
              });

              /* [check] */
              count == list.length ? (exists==false?document.querySelector('.type_g[type="'+type+'"]').remove():false):false; 
            }
          }
        }
      }
      loop(json_2.anime, 'Anime');
      loop(json_2.music, 'Music');
      loop(json_2.drama, 'Drama');
    } catch(e) {
      console.log(e);
    }
  });
