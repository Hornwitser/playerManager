import {getUserFromPlayer, getPlayerList, getUserData, getSession, getToken, arrayRemoveDuplicates} from "./playerManager.js"

(async function(){
	console.log(await getPlayerList())
	let playerlistDisplayContainer = document.querySelector("#playerlistDisplayContainer");
	playerlistDisplayContainer.innerHTML = await renderPlayerlist(await getPlayerList());

})();

async function renderPlayerlist(playerList){
	let html = '<div class="card-deck">';
	let cardCount = 1;
	for(let player in playerList){
		player = playerList[player];
		html += '<div class="card">' +
			'		<div class="card-body">';
		// check if this player has a profile
		let username = await getUserFromPlayer(player.name);
		console.log(username);
		if(username){
			html += `<h5 class="card-title"><a href="/playerManager/profile?username=${username}">${player.name}</a></h5>`
		} else {
			html += '<h5 class="card-title">'+player.name+'</h5>';
		}
		Object.keys(player).forEach(key => {
			if(key.includes("onlineTime") && !isNaN(Number(player[key]))){
				player.onlineTimeTotal += Number(player[key]);
			}
		});
		if(player.connected === "true"){
			html += ' <p class="card-text"><small class="text-muted">Online on '+await getInstanceName(player.instanceID)+"</small></p>";
			html += "<p>Playtime: "+(Math.floor((Number(player.onlineTime)+(Number(player.onlineTimeTotal)||0))/60/60/60*10)/10)+" hours</p>";
		} else {
			html += '<p class="card-text"><small class="text-muted">Offline</small></p>';
			html += "<p>Playtime: "+(Math.floor(((Number(player.onlineTimeTotal)||0))/60/60/60*10)/10)+" hours</p>";
		}
		html += "</div></div>";
        if(cardCount === 2) {
            html += '</div>';
            html += '<div class="card-deck">';
            cardCount = 0;
        }
        else {
        	cardCount++;
		}
	}
    html += "</div>";
	console.log(html);
	return html;
}
