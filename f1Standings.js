console.log('f1Standings.js loaded')

async function fetchStandings() {
    try {
        // Jolpica is the community successor to the retired Ergast API
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching standings:', error);
        return null;
    }
}

async function driverDetails() {
    try {
        const data = await fetchStandings();
        if (!data) return [];
        const currentDriverStandings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        const driverDetails = currentDriverStandings.reduce((acc, driver) => {
            const position = driver.position;
            const firstName = driver.Driver.givenName;
            const surName = driver.Driver.familyName;
            const points = driver.points;
            const nationality = driver.Driver.nationality;
            const link = driver.Driver.url;
            const team = driver.Constructors[0].name;
            const teamId = driver.Constructors[0].constructorId;
            const teamLink = driver.Constructors[0].url;
            acc.push({
                position: position,
                firstName: firstName,
                surName: surName,
                points: points,
                nationality: nationality,
                wikiLink: link,
                team: team,
                teamId: teamId,
                teamLink: teamLink
            });
            return acc;
        }, []);
        return driverDetails;
    } catch (error) {
        console.error('Error parsing driver details:', error);
        return [];
    }
}

async function seasonDetails() {
    try {
        const data = await fetchStandings();
        if (!data) return { season: '?', round: '?' };
        const currentSeasonData = data.MRData.StandingsTable.StandingsLists[0];
        const season = currentSeasonData.season;
        const round = currentSeasonData.round;
        return { season: season, round: round };
    } catch (error) {
        console.error('Error parsing season details:', error);
        return { season: '?', round: '?' };
    }
}

(async function () {
    const drivers = await driverDetails();
    const season = await seasonDetails();
    console.table(drivers);

    const table = document.getElementById("standingsTable");
    const seasontitle = document.getElementById("season");

    if (!drivers.length) {
        table.querySelector("tbody").innerHTML = '<tr><td colspan="5">Failed to load standings. Check console or try again later.</td></tr>';
        seasontitle.innerHTML = 'Formula 1 Standings (unavailable)';
        return;
    }

    let standingsHTML = "";
    drivers.forEach(driver => {
        const driverHTML = `
                    <tr>
                        <td>${driver.position}</td>
                        <td><a class="${driver.teamId}" href="${driver.wikiLink}" target="_blank" rel="noopener">${driver.firstName} ${driver.surName}</a></td>
                        <td>${driver.nationality}</td>
                        <td>${driver.team}</td>
                        <td>${driver.points}</td>
                    </tr>
                `;
        standingsHTML += driverHTML;
    });

    table.querySelector("tbody").innerHTML = standingsHTML;
    seasontitle.innerHTML = `Formula 1 Standings — ${season.season} Season, Round ${season.round}`;
})();

function toggleDarkmode() {
    document.body.classList.toggle("darkmode");
}
