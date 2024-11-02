// ==UserScript==
// @name         RailMiles Kilometres
// @namespace    https://tomr.me
// @version      1.0.0
// @description  Add distances to RailMiles journeys in KM
// @author       TomR.me
// @match        https://my.railmiles.me/journeys/rail/edit/*
// @match        https://my.railmiles.me/journeys/rail/new
// @icon         http://www.railmiles.me/assets/img/rm-logo-sm.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const fieldset = document.getElementById("id_distance_miles").parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

    fieldset.innerHTML += `
    <div style="padding: 0 4px;">
       <label>Kilometres <span style="color: #999">(will be converted to chains)</span> <input type="number" min="0" step="any" onkeyup="setChains(this.value)" onchange="setChains(this.value)"></label>
    </div>`;

    window.setChains = function(inputVal) {
        const km = parseFloat(inputVal);
        document.getElementById("id_distance_miles").value = "";
        document.getElementById("id_distance_chains").value = Math.ceil(km * 49.7096954); // ceil might make it slightly longer, but it's only going to add max 18ish metres
    }
})();
