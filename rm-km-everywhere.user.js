// ==UserScript==
// @name         RailMiles Use Kilometres Everywhere
// @namespace    https://tomr.me
// @version      1.0.1
// @description  Show distances on RailMiles in KM
// @author       TomR.me
// @match        https://*.railmiles.me/
// @match        https://*.railmiles.me/journeys*
// @match        https://my.railmiles.me/leagues/*
// @match        https://*.railmiles.me/statistics/tractionleague/
// @icon         http://www.railmiles.me/assets/img/rm-logo-sm.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.changeToKM = function() {
        console.log("to km!");

        let elementsWithMiles = [];

        // on homepage
        if(location.pathname == "/") {
            // big ones at the top
            document.querySelectorAll(".significant-value").forEach(e => { elementsWithMiles.push(e) });
            // journey details for most recent journeys
            document.querySelectorAll(".journey-details small").forEach(e => { elementsWithMiles.push(e) });
            // longest journeys
            document.querySelectorAll(".small-3.columns").forEach(e => { elementsWithMiles.push(e) });
        }

        // on journey list page
        if(location.pathname.startsWith("/journeys")) {
            // at the top
            document.querySelectorAll(".significant-value span").forEach(e => { elementsWithMiles.push(e) });
            document.querySelectorAll(".significant-value div").forEach(e => { elementsWithMiles.push(e) });

            // in the table
            document.querySelectorAll("#journeytable-body td").forEach(e => { elementsWithMiles.push(e) });
        }

        // on league pages
        if(location.pathname.startsWith("/leagues")) {
            document.querySelectorAll(".league-member .distance").forEach(e => { elementsWithMiles.push(e) });
        }

        // traction league
        if(location.pathname.startsWith("/statistics/tractionleague")) {
            document.querySelectorAll(".significant-value").forEach(e => { elementsWithMiles.push(e) });
            document.querySelectorAll(".tractionleague .distance").forEach(e => { elementsWithMiles.push(e) });
        }

        if(!elementsWithMiles) return;


        elementsWithMiles.forEach(e => {
            const plainText = e.innerText;

            let miles = 0;
            let chains = 0;

            try {
                miles = parseInt(plainText.match(/\d*mi/)[0].replace("mi",""));
            } catch (err) { }

            try {
                chains = parseInt(plainText.match(/\d*ch/)[0].replace("ch", ""));
            } catch (err) { }

            if(miles === 0 && chains === 0) return;

            const totalChains = (miles * 80) + chains;
            const totalKM = totalChains * 0.0201168;
            const totalKMFormatted = totalKM.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});

            const toReplace = (plainText.match(/\d*mi/g).length > 0) ? "mi" : "ch";
            const toWipe = (toReplace === "mi") ? "ch" : "mi";

            const replaceRx = new RegExp(String.raw`\d*${toReplace}`, "g");
            const wipeRx = new RegExp(String.raw`\d*${toWipe}`, "g");

            e.innerHTML = e.innerHTML.replace(wipeRx, "");
            e.innerHTML = e.innerHTML.replace(replaceRx, `<span style="font-weight: bold; font-family: monospace;">${totalKMFormatted}</span> km`);
        });
    }

    window.changeToKM();

    // run again after a few seconds just in case something needed to load
    window.setTimeout(window.changeToKM, 2000);
})();
