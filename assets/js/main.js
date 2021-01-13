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
            this.getFilms;
            this.getSeries;

            Promise.all([this.getFilms(), this.getSeries()]).then((results) => {
                let films = results[0].data.results;
                let series = results[1].data.results;
                this.films = films.concat(series);

                this.films.map((film) => {
                    return (film.stars = Math.round(film.vote_average / 2));
                });
                this.films.map((film) => {
                    return (film.flag = this.getFlag(film.original_language));
                });

                this.films.forEach((film) => {
                    if (!film.original_name) {
                        //cioè se non sono serie e quindi sono films
                        this.getMovieDetails(film.id);
                        this.getMovieCredits(film.id);

                        Promise.all([
                            this.getMovieDetails(film.id),
                            this.getMovieCredits(film.id),
                        ])
                            .then((responses) => {
                                let genres = responses[0].data.genres;
                                let cast = responses[1].data.cast;
                                film.genre_names = [];
                                film.cast = [];
                                for (const genre of genres) {
                                    film.genre_names.push(genre["name"]);
                                }
                                for (let i = 0; i < 5; i++) {
                                    film.cast.push(cast[i].name);
                                }
                            })
                            .catch((error) => console.log(error));
                    }
                });
            });
            // this.getMovieDetails;
            // this.getMovieCredits;

            // Promise.all([this.getMovieDetails(), this.getMovieCredits()]).then(
            //     (results) => {
            //         console.log(results[0]);
            //         console.log(results[1]);
            //     }
            // );
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
        getMovieDetails(film_id) {
            return axios.get(
                `https://api.themoviedb.org/3/movie/${film_id}?api_key=211f9317ff0f147fee603f1b9da7607e`
            );
        },
        getMovieCredits(film_id) {
            return axios.get(
                `https://api.themoviedb.org/3/movie/${film_id}/credits?api_key=211f9317ff0f147fee603f1b9da7607e`
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
        cutOverview(overview, length) {
            let cutted = "";
            overview != ""
                ? (cutted = overview.slice(0, length) + "...")
                : (cutted = "no overview available");
            return cutted;
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
