//* API Key = 211f9317ff0f147fee603f1b9da7607e

const app = new Vue({
    el: "#app",
    data: {
        searchString: "",
        films: null,
    },
    methods: {
        search() {
            axios
                .get(
                    `https://api.themoviedb.org/3/search/movie?api_key=211f9317ff0f147fee603f1b9da7607e&query=${this.searchString}`
                )
                .then((response) => {
                    let results = response.data.results;
                    this.films = results;
                });
        },
    },
});
