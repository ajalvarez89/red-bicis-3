var map = L.map('main_map').setView([-38.961204, -68.240558], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//L.marker([-38.961204, -68.240558]).addTo(map)

$.ajax({
    dataType: "json",
    url: "/api/bicicletas",
    success: function(result) {
        console.log(result);
        result.bicicleta.forEach(function(bici) {
            L.marker(bici.ubicacion, { title: bici.id }).addTo(map);
        })
    }
})