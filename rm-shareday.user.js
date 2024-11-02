// ==UserScript==
// @name         RailMiles Share a Day
// @namespace    https://tomr.me
// @version      1.0.1
// @description  Share an entire day's journeys with someone on RailMiles
// @author       TomR.me
// @match        https://my.railmiles.me/journeys/list/*
// @icon         http://www.railmiles.me/assets/img/rm-logo-sm.png
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    // for every date, add buttons and make its group have an ID
    let dateNum = 0;
    for (const e of document.querySelectorAll("h3")) {
        e.nextElementSibling.dataset.shareDate = `${dateNum}`;

        e.innerHTML += `
            <span style="display: block;">
                <a style="font-size: 0.8em; color: #999; cursor: pointer;" onclick="shareDay(${dateNum})">Share this day's journeys ➶</a>
            </span>

            <span style="display: block; font-size: 0.8em; color: blue;" id="share-status-${dateNum}"></span>
        `;

        dateNum++;
    }

    unsafeWindow.shareDay = function(d) {
        let toShare = new Set();
        const journeyElements = document.querySelectorAll(`*[data-share-date="${d}"] .share-journey`);

        for(const e of journeyElements) {
            try {
                toShare.add(parseInt(e.getAttribute("journey-id")));
            } catch (err) {
                console.error(e, err);
            }
        }

        const username = prompt(`Enter a RailMiles username to share these ${toShare.size} journeys with:`);
        if(!username) return alert("Nothing entered, not doing anything.");


        const journeyIDs = Array.from(toShare);
        for(const i in journeyIDs) {
            const j = journeyIDs[i];
            window.setTimeout(shareAJourney, i*1000, j, username, d, journeyIDs.length, i);
        }
    }

    unsafeWindow.shareAJourney = async function(journeyID, username, day, journeyCount, currentJourney) {
        document.getElementById(`share-status-${day}`).innerText = `Sharing journey ${(parseInt(currentJourney)+1)} of ${journeyCount} with ${username}...`;

        const r = await fetch(`/system/social/share?j=${journeyID}&u=${username}`);
        console.log(r);

        if(!r.ok) {
            alert(`Error sharing journey ${journeyID} - code ${r.status}!\nThe most likely cause is that you have entered an incorrect username. Please check and try again.`);
            console.error(r);
        }

        try {
            const json = await r.json();
            console.log(journeyID, username, json);
            document.getElementById(`share-status-${day}`).innerText = `Shared journey ${(parseInt(currentJourney)+1)} of ${journeyCount}: ${json.error ? json.error : 'Seemed OK!'}`;
        } catch (err) {
            alert(`Error decoding response for journey ${journeyID}: ${err}\nThis is also in your browser console.`);
            console.error(err);
        }
    }
})();
