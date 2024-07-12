console.log('fetch-standings.js loaded')

async function fetchStandings() {
    try {
        const response = await fetch('https://ergast.com/api/f1/current/driverStandings.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching standings:', error);
        return null;
    }
}

async function driverDetails() {
    try {
        const data = await fetchStandings();
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
        console.log('Error:', error);
    }
}

async function seasonDetails() {
    try {
        const data = await fetchStandings();
        const currentSeasonData = data.MRData.StandingsTable.StandingsLists[0];
        const season = currentSeasonData.season;
        const round = currentSeasonData.round;
        return { season: season, round: round };
    } catch (error) {
        console.log('Error:', error);
    }
}

(async function () {

    const drivers = await driverDetails();
    const season = await seasonDetails();
    console.table(drivers)
    const table = document.getElementById("standingsTable");
    const seasontitle = document.getElementById("season");
    // Zac start coding here!s
    standingsHTML = "";
    drivers.forEach(driver => {
        driverHTML = `
                    <tr>
                        <td>${driver.position}</td>
                        <td><a class="${driver.teamId}" href="${driver.wikiLink}">${driver.firstName} ${driver.surName}</a></td>
                        <td>${driver.nationality}</td>
                        <td>${driver.team}</td>
                        <td>${driver.points}</td>
                    </tr>
                `
        standingsHTML = standingsHTML + driverHTML;
    })
    console.log(standingsHTML)


    table.querySelector("tbody").innerHTML = standingsHTML
    seasontitle.innerHTML = ` Formula 1 Standings For ${season.season} Season, Current Round: ${season.round}`
})();

function toggleDarkmode(){
    if(document.body.classList.contains("darkmode")){
        document.body.classList.remove("darkmode")
        return
    }
    document.body.classList.add("darkmode")
}