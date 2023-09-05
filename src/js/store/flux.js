const URL_BASE = "https://probable-fishstick-49wgx99xvpv3qqpg-3000.app.github.dev/";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			details: [],
			Planets: [],
			favoritos: [],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			auth: false,
			characters: [],
			vehiculos: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			obtenerVehiculosClaudia: async () => {
				/**
					fetch().then().then(data => setStore({ "foo": data.bar }))
				*/
				try {
					let response = await fetch("https://swapi.dev/api/vehicles", {
						method: "GET"
					});

					let data = await response.json();
					setStore({ vehiculos: data.results });


				} catch (error) {
					console.log(error)
				}

			},
			obtenerPersonajes: async () => {
				/**
					fetch().then().then(data => setStore({ "foo": data.bar }))
				*/

				try {
					let response = await fetch("https://swapi.dev/api/people"); //especificamos la url donde vamos a buscar info
					let data = await response.json()
					setStore({ characters: data.results })

				} catch (error) {
					console.log(error)

				}
			},
			obtenerplanetas: async function () {
				//accion, funcion que puedo volver a utilizar cuando quiera
				try {
					let response = await fetch("https://swapi.dev/api/planets"); //esto me regresa una respuesta, que la guerdo en un espacio de memoira
					//le digo que espere por esa respuesta
					let data = await response.json(); //le digo que convierta esa respuesta en un jason y lo guardo en un espacio de memoira y que espere por la convercion de esa respuesta
					setStore({ Planets: data.results }); //({propiedad:el valor que quiero actuaizar})
				} catch (error) {
					console.log(error);
				}
			},
			agregarFavorito: (name) => {


				setStore({ favoritos: [...getStore().favoritos, name] });



			},
			eliminarFavorito: (name) => {
				const arr = getStore().favoritos.filter((name2) =>
					name2 !== name)
				setStore({ favoritos: arr });

			},
			getDetails: async (type, id) => {
				/**
					fetch().then().then(data => setStore({ "foo": data.bar }))
				*/

				if (type !== "characters") {
					const data = await fetch("https://swapi.dev/api/" + type + "/" + id);
					const response = await data.json();
					setStore({ details: response })
				} else {
					const data = await fetch("https://swapi.dev/api/people/" + id);
					const response = await data.json();
					setStore({ details: response })
				}



			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			singUp: async (email, password) => {
				try {
					let response = await fetch(URL_BASE + "/singup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email,
							password,
						}),
					});
					const data = await response.json();
					return true;
				} catch (error) {
					console.log(error);
					return false;
				}
			},
			login: async (email, password) => {
				try {
					let response = await fetch(URL_BASE + "/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email,
							password,
						})
					})
					let data = await response.json();
					localStorage.setItem("token", data.access_token);
					setStore({ auth: true });
					return true;
				} catch (error) {
					console.log(error);
					return false;
				}
			},
			validateToken: async () => {
				let token = localStorage.getItem("token") || "";

				try {
					let response = await fetch(URL_BASE + "/validate_token", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + token
						},
					})
					if (token === "") {
						return false;
					}

					if (response.msg == "Token has expired") {
						return false;
					}
					if (response) {
						setStore({ auth: true });
					}
					return true;
				} catch (error) {
					console.log(error);
					if (error.response.status > 400) {
						alert(error.response.data.msg);
					}
					setStore({ auth: false });

					return false;
				}
			},
			logout: async () => {
				localStorage.removeItem("token");
				setStore({ auth: false });
			},
			getFavorites: async () => {
				let token = localStorage.getItem("token");

				try {
					let response = await fetch(URL_BASE + "/user/favorites", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + token
						},
					})

					let data = await response.json();

					setStore({ favoritos: data.results });

					return true;
				} catch (error) {
					console.log(error);
					if (error.response.status > 400) {
						alert(error.response.data.msg);
					}
					setStore({ auth: false });

					return false;
				}
			}
		}
	};
};

export default getState;