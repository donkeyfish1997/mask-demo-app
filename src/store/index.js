import { createStore } from "vuex";

export default createStore({
  state: {
    currCity: "臺北市",
    currDistrict: "北投區",
    location: [],
    stores: [],
    keywords: "",
    showModal: false,
    infoBoxSid: null,
  },
  actions: {
    async fetchLocations({ commit }) {
      const json = await fetch(
        "https://raw.githubusercontent.com/kurotanshi/mask-map/master/raw/area-location.json"
      ).then((res) => res.json());
      commit("setAreaLocation", json);
    },
    async fetchPharmacies({ commit }) {
      const json = await fetch(
        "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json"
      ).then((res) => res.json());
      const data = json.features.map((d) => ({
        ...d.properties,
        latitud: d.geometry.coordinates[0],
        longitude: d.geometry.coordinates[1],
      }));
      commit("setStores", data);
    },
  },
  mutations: {
    setCurrCity(state, payload) {
      state.currCity = payload;
    },
    setCurrDistrict(state, payload) {
      state.currDistrict = payload;
    },
    setAreaLocation(state, payload) {
      state.location = payload;
    },
    setStores(state, payload) {
      state.stores = payload;
    },
    setKeywords(state, payload) {
      state.keywords = payload;
    },
    setShowModal(state, payload) {
      state.showModal = payload;
    },
    setInfoBoxSid(state, payload) {
      state.infoBoxSid = payload;
    },
  },
  getters: {
    cityList(state) {
      return state.location.map((d) => d.name);
    },
    districtList(state) {
      return (
        state.location.find((d) => d.name === state.currCity)?.districts || []
      );
    },
    filteredStores(state) {
      const { currCity, currDistrict, stores, keywords } = state;
      if (keywords) {
        return stores.filter((d) => d.name.includes(keywords));
      }
      return stores.filter(
        (d) => d.county == currCity && d.town == currDistrict
      );
    },
    currDistrictInfo(state, getters) {
      return (
        getters.districtList.find((d) => d.name === state.currDistrict) || {}
      );
    },
  },
});
