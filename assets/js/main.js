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
    },
});
