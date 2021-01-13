//* API Key = 211f9317ff0f147fee603f1b9da7607e

/*
esempio chiamata per serie tv
https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=s
crubs
*/

const app = new Vue({
    el: "#app",
    data: {
        searchString: "",
        films: null,
        flags: null,
    },
    methods: {
        search() {
            this.getFilms();
            this.getSeries();

            Promise.all([this.getFilms(), this.getSeries()]).then((results) => {
                let films = results[0].data.results;
                let series = results[1].data.results;
                this.films = films.concat(series);

                this.films.map((film) => {
                    return (film.stars = Math.round(film.vote_average / 2));
                });
                this.films.map((film) => {
                    return (film.flag = `https://www.countryflags.io/${film.original_language}/flat/32.png`);
                });
                this.films.map((film) => {
                    return (film.emoji = this.getFlag(film.original_language));
                });
            });
        },
        getFilms() {
            return axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=211f9317ff0f147fee603f1b9da7607e&query=${this.searchString}`
            );
        },
        getSeries() {
            return axios.get(
                `https://api.themoviedb.org/3/search/tv?api_key=211f9317ff0f147fee603f1b9da7607e&language=it_IT&query=${this.searchString}`
            );
        },
        cardBg(p_path) {
            if (p_path) {
                return `background-image: url(https://image.tmdb.org/t/p/w342${p_path}); background-size: cover`;
            } else {
                return "background-image: url(./assets/img/no-poster.jpg); background-size: cover";
            }
        },
        getFlag(film_lang) {
            let param = film_lang.toUpperCase();
            let emoji = param;
            this.flags.forEach((flag) => {
                if (param === flag.code) emoji = flag.emoji;
                else if (param === "EN") {
                    if (flag.code === "GB") emoji = flag.emoji;
                } else if (param === "JA") {
                    if (flag.code === "JP") emoji = flag.emoji;
                }
            });
            return emoji;
        },
    },
    created() {
        axios
            .get(
                "https://unpkg.com/country-flag-emoji-json@1.0.2/json/flag-emojis.pretty.json"
            )
            .then((response) => (this.flags = response.data));
    },
});
