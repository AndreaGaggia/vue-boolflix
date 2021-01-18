const app = new Vue({
    el: "#app",
    data: {
        apiKey: "211f9317ff0f147fee603f1b9da7607e",
        searchString: "",
        resultsString: "",
        searchBy: "",
        movies: [],
        totalMovies: null,
        moviesPages: null,
        moviesInterval: [],
        moviePage: 1,
        series: [],
        totalSeries: null,
        seriesPages: null,
        seriesInterval: [],
        seriePage: 1,
        initialPage: 1,
        trendingMovies: [],
        trendingSeries: [],
        visible: false,
    },
    methods: {
        search() {
            this.movies = [];
            this.series = [];
            if (this.searchBy == "" || this.searchBy == "All") {
                this.getAll();
            } else if (this.searchBy == "Movies") {
                this.getOnlyMovies();
            } else {
                this.getOnlySeries();
            }
            this.printString();
            this.searchString = "";
        },
        getBackground(poster_path) {
            if (poster_path) {
                return `background-image: url(https://image.tmdb.org/t/p/w342${poster_path}); background-size: cover`;
            } else
                return "background-image: url(./placeholder-movieimage.png); background-size: cover";
        },
        getOnlyMovies() {
            axios
                .get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.searchString}`
                )
                .then((response) => {
                    let mPages = response.data.total_pages;
                    this.moviesPages = mPages;
                    this.moviesInterval = this.setInitialInterval(
                        this.moviesPages
                    );
                    let totalMovies = response.data.total_results;
                    this.totalMovies = totalMovies;
                    let results = response.data.results;
                    let movies = [];
                    results.forEach((media) => {
                        let newMovie = {
                            id: media.id,
                            popularity: media.popularity,
                            title: media.title,
                            original_title: media.original_title,
                            language: media.original_language,
                            poster: media.poster_path,
                            overview: media.overview,
                            vote: media.vote_average,
                            release_date: media.release_date,
                        };
                        movies.push(newMovie);
                    });
                    this.movies = movies;
                })
                .catch((error) => console.log(error));
        },
        getOnlySeries() {
            axios
                .get(
                    `https://api.themoviedb.org/3/search/tv?api_key=${this.apiKey}&query=${this.searchString}`
                )
                .then((response) => {
                    let sPages = response.data.total_pages;
                    this.seriesPages = sPages;
                    this.seriesInterval = this.setInitialInterval(
                        this.seriesPages
                    );
                    let totalSeries = response.data.total_results;
                    this.totalSeries = totalSeries;
                    let results = response.data.results;
                    let series = [];
                    results.forEach((media) => {
                        let newSerie = {
                            id: media.id,
                            popularity: media.popularity,
                            title: media.name,
                            original_title: media.original_name,
                            language: media.original_language,
                            poster: media.poster_path,
                            overview: media.overview,
                            vote: media.vote_average,
                            release_date: media.first_air_date,
                        };
                        series.push(newSerie);
                    });
                    this.series = series;
                })
                .catch((error) => console.log(error));
        },
        getAll() {
            Promise.all([
                axios.get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.searchString}`
                ),
                axios.get(
                    `https://api.themoviedb.org/3/search/tv?api_key=${this.apiKey}&query=${this.searchString}`
                ),
            ])
                .then((response) => {
                    let mPages = response[0].data.total_pages;
                    let sPages = response[1].data.total_pages;
                    this.moviesPages = mPages;
                    this.seriesPages = sPages;
                    this.moviesInterval = this.setInitialInterval(
                        this.moviesPages
                    );
                    this.seriesInterval = this.setInitialInterval(
                        this.seriesPages
                    );
                    let totalMovies = response[0].data.total_results;
                    this.totalMovies = totalMovies;
                    let totalSeries = response[1].data.total_results;
                    this.totalSeries = totalSeries;
                    let rawSeries = response[0].data.results;
                    let rawMovies = response[1].data.results;
                    let results = rawSeries.concat(rawMovies);
                    let series = [];
                    let movies = [];
                    results.forEach((media) => {
                        if (media.title) {
                            let newMovie = {
                                id: media.id,
                                popularity: media.popularity,
                                title: media.title,
                                original_title: media.original_title,
                                language: media.original_language,
                                poster: media.poster_path,
                                overview: media.overview,
                                vote: media.vote_average,
                                release_date: media.release_date,
                            };
                            movies.push(newMovie);
                        } else if (media.name) {
                            let newSerie = {
                                id: media.id,
                                popularity: media.popularity,
                                title: media.name,
                                original_title: media.original_name,
                                language: media.original_language,
                                poster: media.poster_path,
                                overview: media.overview,
                                vote: media.vote_average,
                                release_date: media.first_air_date,
                            };
                            series.push(newSerie);
                        }
                    });
                    this.movies = movies;
                    this.series = series;
                })
                .catch((error) => console.log(error));
        },
        getTrending() {
            axios
                .get(
                    `https://api.themoviedb.org/3/trending/all/week?api_key=${this.apiKey}`
                )
                .then((response) => {
                    let results = response.data.results;
                    results.forEach((media) => {
                        if (media.media_type == "movie") {
                            let newMovie = {
                                id: media.id,
                                popularity: media.popularity,
                                title: media.title,
                                original_title: media.original_title,
                                language: media.original_language,
                                poster: media.poster_path,
                                overview: media.overview,
                                vote: media.vote_average,
                                release_date: media.release_date,
                            };
                            this.trendingMovies.push(newMovie);
                        } else if (media.media_type == "tv") {
                            let newSerie = {
                                id: media.id,
                                popularity: media.popularity,
                                title: media.name,
                                original_title: media.original_name,
                                language: media.original_language,
                                poster: media.poster_path,
                                overview: media.overview,
                                vote: media.vote_average,
                                release_date: media.first_air_date,
                            };
                            this.trendingSeries.push(newSerie);
                        }
                    });
                })
                .catch((error) => console.log(error));
        },
        printString() {
            if (this.searchString) {
                let beforeDelete = this.searchString;
                this.resultsString = beforeDelete;
                this.visible = true;
            } else {
                this.visible = false;
            }
        },
        changePage(page, media_pages) {
            if (media_pages === this.moviesPages) {
                axios
                    .get(
                        `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.resultsString}&page=${page}`
                    )
                    .then((response) => {
                        let results = response.data.results;
                        let movies = [];
                        results.forEach((media) => {
                            let newMovie = {
                                id: media.id,
                                popularity: media.popularity,
                                title: media.title,
                                original_title: media.original_title,
                                language: media.original_language,
                                poster: media.poster_path,
                                overview: media.overview,
                                vote: media.vote_average,
                                release_date: media.release_date,
                            };
                            movies.push(newMovie);
                        });
                        this.movies = movies;
                        this.moviePage = page;
                    })
                    .catch((error) => console.log(error));
            } else {
                axios
                    .get(
                        `https://api.themoviedb.org/3/search/tv?api_key=${this.apiKey}&query=${this.resultsString}&page=${page}`
                    )
                    .then((response) => {
                        let results = response.data.results;
                        let series = [];
                        results.forEach((media) => {
                            let newSerie = {
                                id: media.id,
                                popularity: media.popularity,
                                title: media.name,
                                original_title: media.original_name,
                                language: media.original_language,
                                poster: media.poster_path,
                                overview: media.overview,
                                vote: media.vote_average,
                                release_date: media.first_air_date,
                            };
                            series.push(newSerie);
                        });
                        this.series = series;
                        this.seriePage = page;
                    })
                    .catch((error) => console.log(error));
            }
        },
        setInitialInterval(total_pages) {
            let interval = [];
            if (total_pages <= 10) {
                for (let i = 1; i <= total_pages; i++) {
                    interval.push(i);
                }
            } else {
                for (let i = 1; i <= 10; i++) {
                    interval.push(i);
                }
            }
            return interval;
        },
        changeInterval(media_interval) {
            if (media_interval == this.moviesInterval) {
                let interval = [];
                let newPage =
                    this.moviesInterval[this.moviesInterval.length - 1] + 1;
                for (
                    let i = newPage;
                    i < newPage + 10 && i <= this.moviesPages;
                    i++
                ) {
                    interval.push(i);
                }
                this.moviePage = newPage;
                this.moviesInterval = interval;
                this.changePage(this.moviePage, this.moviesPages);
            } else {
                let interval = [];
                let newPage =
                    this.seriesInterval[this.seriesInterval.length - 1] + 1;
                for (
                    let i = newPage;
                    i < newPage + 10 && i <= this.seriesPages;
                    i++
                ) {
                    interval.push(i);
                }
                this.seriePage = newPage;
                this.seriesInterval = interval;
                this.changePage(this.seriePage, this.seriesPages);
            }
        },
    },
    mounted() {
        this.getTrending();
    },
});
