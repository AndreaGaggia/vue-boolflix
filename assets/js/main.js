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

                this.films.forEach((film) => {
                    if (!film.hasOwnProperty("original_name")) {
                        this.addCast(film);
                    }
                });
            });
            this.searchString = "";
        },
        addCast(film) {
            let risultatoCast = this.getMovieCast(film.id);
            return Vue.set(film, "cast", risultatoCast);
            // console.log("risultato addCastCast:");
            // console.log(risultatoCast);
            // film.cast = this.getMovieCast(film.id);
            // console.log(film.cast);
            // console.log(typeof film.cast);
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
        getMovieGenres(film_id) {
            let filmGenres = [];
            axios
                .get(
                    `https://api.themoviedb.org/3/movie/${film_id}?api_key=211f9317ff0f147fee603f1b9da7607e`
                )
                .then((response) => {
                    let genres = response.data.genres;
                    if (genres)
                        genres.forEach((genre) => filmGenres.push(genre.name));
                });
            return filmGenres;
        },
        getMovieCast(film_id) {
            let movieCast = [];
            axios
                .get(
                    `https://api.themoviedb.org/3/movie/${film_id}/credits?api_key=211f9317ff0f147fee603f1b9da7607e`
                )
                .then((response) => {
                    let cast = response.data.cast;
                    //console.log("richiesta cast");
                    if (cast && cast.length >= 5) {
                        for (let i = 0; i < 5; i++) {
                            console.log(cast[i].name, film_id);
                            movieCast.push(cast[i].name);
                        }
                    } else if (cast && cast.length < 5) {
                        //es. movie 587870
                        for (let i = 0; i < cast.length; i++) {
                            console.log(cast[i].name, film_id);
                            movieCast.push(cast[i].name);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    movieCast = "non disponibile";
                });
            console.log(movieCast);
            return movieCast;
        },
        cardBg(p_path) {
            if (p_path) {
                return `background-image: url(https://image.tmdb.org/t/p/w342${p_path}); background-size: cover`;
            } else {
                return "background-image: url(./assets/img/no-poster.jpg); background-size: cover";
            }
        },
        getFlag(film_lang) {
            let lang = film_lang.toUpperCase();
            let emoji = lang;
            this.flags.forEach((flag) => {
                if (lang === flag.code) emoji = flag.emoji;
                else if (lang === "EN") {
                    if (flag.code === "GB") emoji = flag.emoji;
                } else if (lang === "JA") {
                    if (flag.code === "JP") emoji = flag.emoji;
                }
            });
            return emoji;
        },
        getRate(vote) {
            return Math.round(vote / 2);
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

// this.films.forEach((film) => {
//     if (!film.hasOwnProperty("original_name") && film.id) {
//         axios
//             .get(
//                 `https://api.themoviedb.org/3/movie/${film.id}/credits?api_key=211f9317ff0f147fee603f1b9da7607e`
//             )
//             .then((response) => {
//                 let cast5 = [];
//                 let castAll = response.data.cast;
//                 if (castAll) {
//                     for (let i = 0; i < 5; i++) {
//                         cast5.push(castAll[i].name);
//                     }
//                 }
//                 console.log(cast5);
//                 film.cast = cast5;
//             })
//             .catch(() => console.log("Cast non disponibile"));
//     }
// });
