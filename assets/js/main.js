//* API Key = 211f9317ff0f147fee603f1b9da7607e

const app = new Vue({
    el: "#app",
    data: {
        searchString: "",
        films: null,
        flags: [],
        options: [],
        optionValue: "",
        all: null,
    },
    methods: {
        search() {
            this.options = [];
            this.optionValue = "";

            this.getFilms;
            this.getSeries;
            Promise.all([this.getFilms(), this.getSeries()]).then((results) => {
                let films = results[0].data.results;
                let series = results[1].data.results;
                this.films = films.concat(series);
                this.all = this.films;
                //add cast for both movies and series
                this.films.forEach((film) => this.addCast(film));
                //add genres
                this.films.forEach((film) => this.addGenres(film));
            });
            this.searchString = "";
        },
        filter(option) {
            let all = JSON.parse(JSON.stringify(this.all));
            let filtered = [];
            all.forEach((film) => {
                if (film.genre_names.includes(option)) {
                    filtered.push(film);
                }
            });
            if (option && option != "All") {
                this.films = filtered;
            } else this.films = all;
        },
        addCast(film) {
            if (film.hasOwnProperty("original_name")) {
                return Vue.set(film, "cast", this.getSerieCast(film.id));
            } else return Vue.set(film, "cast", this.getMovieCast(film.id));
        },
        addGenres(film) {
            if (film.hasOwnProperty("original_name")) {
                return Vue.set(
                    film,
                    "genre_names",
                    this.getSerieGenres(film.id)
                );
            } else
                return Vue.set(
                    film,
                    "genre_names",
                    this.getMovieGenres(film.id)
                );
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
                        genres.forEach((genre) => {
                            filmGenres.push(genre.name);
                            this.options.push(genre.name);
                            this.options = Array.from(new Set(this.options));
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
            return filmGenres;
        },
        getSerieGenres(film_id) {
            let serieGenres = [];

            axios
                .get(
                    `https://api.themoviedb.org/3/tv/${film_id}?api_key=211f9317ff0f147fee603f1b9da7607e`
                )
                .then((response) => {
                    let genres = response.data.genres;
                    if (genres)
                        genres.forEach((genre) => {
                            serieGenres.push(genre.name);
                            this.options.push(genre.name);
                            this.options = Array.from(new Set(this.options));
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
            return serieGenres;
        },
        getMovieCast(film_id) {
            let movieCast = [];
            axios
                .get(
                    `https://api.themoviedb.org/3/movie/${film_id}/credits?api_key=211f9317ff0f147fee603f1b9da7607e`
                )
                .then((response) => {
                    let cast = response.data.cast;
                    if (cast && cast.length >= 5) {
                        for (let i = 0; i < 5; i++) {
                            movieCast.push(cast[i].name);
                        }
                    } else if (cast && cast.length < 5) {
                        //es. movie 587870
                        for (let i = 0; i < cast.length; i++) {
                            movieCast.push(cast[i].name);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            return movieCast;
        },
        getSerieCast(film_id) {
            let serieCast = [];
            axios
                .get(
                    `https://api.themoviedb.org/3/tv/${film_id}/credits?api_key=211f9317ff0f147fee603f1b9da7607e`
                )
                .then((response) => {
                    let cast = response.data.cast;
                    if (cast && cast.length >= 5) {
                        for (let i = 0; i < 5; i++) {
                            serieCast.push(cast[i].name);
                        }
                    } else if (cast && cast.length < 5) {
                        for (let i = 0; i < cast.length; i++) {
                            serieCast.push(cast[i].name);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            return serieCast;
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
                : (cutted = "not available");
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
