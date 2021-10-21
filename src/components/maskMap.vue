<template>
  <div class="mask-map" id="mask-map"></div>
</template>

<script>
import L from "leaflet";
import { mapGetters } from "vuex";
export default {
  name: "maskMap",
  data() {
    return {
      map: {},
      markers: [],
    };
  },
  mounted() {
    this.map = L.map("mask-map", {
      center: [25.03, 121.55],
      zoom: 14,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '<a target="_blank" href="https://www.openstreetmap.org/"> OpenStreetMap貢獻者</a>',
      maxZoom: 18,
    }).addTo(this.map);
  },
  computed: {
    ...mapGetters(["currDistrictInfo", "filteredStores"]),
  },
  watch: {
    currDistrictInfo(dist) {
      this.map.panTo(new L.LatLng(dist.latitude, dist.longitude));
    },
    filteredStores(sotres) {
      sotres.forEach((e) => this.addMarker(e));
    },
  },
  methods: {
    addMarker(item) {
      const ICON = {
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      };
      const marker = L.marker([item.longitude, item.latitud], ICON)
        .addTo(this.map)
        .bindPopup(`<h2 class="popup-name">${item.name}</h2>`);

      marker.markerId = item.id;
      marker.lng = item.longitude;
      marker.lat = item.latitud;
      this.markers.push(marker);
    },
    triggerPopup(markerId) {
      const marker = this.markers.find((d) => d.markerId === markerId);

      // return;
      this.map.flyTo(new L.latLng(marker.lng, marker.lat), 15);
      marker.openPopup();
    },
  },
};
</script>

<style>
</style>