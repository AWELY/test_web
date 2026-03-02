let playersList = [];

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const newPlayer = {
      id: document.getElementById("riotId").value,
      rankPoints: parseInt(document.getElementById("rank").value),
      rankName:
        document.getElementById("rank").options[
          document.getElementById("rank").selectedIndex
        ].text,
      mainRole: document.getElementById("mainRole").value,
      subRole: document.getElementById("subRole").value,
    };

    playersList.push(newPlayer);
    updateUI();
    this.reset();
  });

function updateUI() {
  const tableBody = document.querySelector("#playersTable tbody");
  tableBody.innerHTML = playersList
    .map(
      (p) =>
        `<tr>
            <td>${p.id}</td>
            <td style="color: #bc8cf2">${p.rankName}</td>
            <td style="font-size: 0.8em">${p.mainRole} / ${p.subRole}</td>
        </tr>`,
    )
    .join("");
  document.getElementById("playerCount").innerText = playersList.length;
}

document.getElementById("balanceBtn").addEventListener("click", function () {
  if (playersList.length < 5) {
    alert("تحتاج 5 لاعبين على الأقل!");
    return;
  }

  let sorted = [...playersList].sort((a, b) => b.rankPoints - a.rankPoints);
  let numTeams = Math.floor(playersList.length / 5);
  let teams = Array.from({ length: numTeams }, () => []);

  // توزيع عادل (Snake Draft)
  sorted.forEach((p, i) => {
    let teamIndex = i % numTeams;
    if (i % (numTeams * 2) >= numTeams) teamIndex = numTeams - 1 - teamIndex; // Snake logic

    if (teams[teamIndex].length < 5) {
      teams[teamIndex].push(p);
    }
  });

  displayResults(teams);
});

function displayResults(teams) {
  const grid = document.getElementById("teamsResult");
  grid.innerHTML = "";

  teams.forEach((team, i) => {
    const teamDiv = document.createElement("div");
    teamDiv.className = "team-card card";
    teamDiv.innerHTML =
      `<h4>TEAM ${i + 1}</h4><ul>` +
      team
        .map(
          (p) =>
            `<li>${p.id} <br><small>${p.mainRole} (2nd: ${p.subRole})</small></li>`,
        )
        .join("") +
      `</ul>`;
    grid.appendChild(teamDiv);
  });

  generateBracket(teams.length);
}

function generateBracket(count) {
  const section = document.getElementById("bracketSection");
  const display = document.getElementById("bracketDisplay");
  section.style.display = "block";
  display.innerHTML = "";

  for (let i = 0; i < count; i += 2) {
    const match = document.createElement("div");
    match.className = "match";
    match.innerHTML = `<span>TEAM ${i + 1}</span> <br> vs <br> <span>${teams[i + 1] ? "TEAM " + (i + 2) : "TBD"}</span>`;
    display.appendChild(match);
  }
}
function generateBracket(teams) {
  const section = document.getElementById("bracketSection");
  const display = document.getElementById("bracketDisplay");

  section.style.display = "block";
  display.innerHTML = ""; // مسح الخريطة القديمة

  // لنفترض أننا سنقوم بعمل مواجهات ثنائية
  for (let i = 0; i < teams.length; i += 2) {
    const team1Name = `Team ${i + 1}`;
    const team2Name = teams[i + 1] ? `Team ${i + 2}` : "انتظار (BYE)";

    const matchHTML = `
            <div class="match-card">
                <span>${team1Name}</span>
                <div class="vs-text">VS</div>
                <span>${team2Name}</span>
            </div>
        `;
    display.innerHTML += matchHTML;
  }
}
