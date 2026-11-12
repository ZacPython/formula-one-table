
console.log('fetch-standings.js loaded');

// Jolpica F1 API (Ergast-compatible replacement)
async function fetchStandings() {
    try {
        const response = await fetch(
            'https://api.jolpi.ca/ergast/f1/current/driverStandings.json'
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error fetching standings:', error);
        return null;
    }
}


// Get driver details
async function driverDetails(data) {
    try {
        if (!data) return [];

        const currentDriverStandings =
            data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;

        if (!currentDriverStandings) return [];

        return currentDriverStandings.map(driver => ({
            position: driver.position,
            firstName: driver.Driver.givenName,
            surName: driver.Driver.familyName,
            points: driver.points,
            nationality: driver.Driver.nationality,
            wikiLink: driver.Driver.url,
            team: driver.Constructors?.[0]?.name ?? 'Unknown',
            teamId: driver.Constructors?.[0]?.constructorId ?? '',
            teamLink: driver.Constructors?.[0]?.url ?? ''
        }));

    } catch (error) {
        console.error('Error getting driver details:', error);
        return [];
    }
}


// Get season details
async function seasonDetails(data) {
    try {
        if (!data) return null;

        const currentSeasonData =
            data.MRData?.StandingsTable?.StandingsLists?.[0];

        if (!currentSeasonData) return null;

        return {
            season: currentSeasonData.season,
            round: currentSeasonData.round
        };

    } catch (error) {
        console.error('Error getting season details:', error);
        return null;
    }
}


// Build and display standings table
(async function () {

    const data = await fetchStandings();

    if (!data) {
        console.error('Unable to load Formula 1 standings.');
        return;
    }

    const drivers = await driverDetails(data);
    const season = await seasonDetails(data);

    console.table(drivers);

    const table = document.getElementById('standingsTable');
    const seasontitle = document.getElementById('season');

    if (!table || !seasontitle) {
        console.error('Could not find standingsTable or season element.');
        return;
    }

    if (!drivers.length || !season) {
        seasontitle.textContent = 'No Formula 1 standings currently available.';
        return;
    }

    let standingsHTML = '';

    drivers.forEach(driver => {

        const driverHTML = `
            <tr>
                <td>${driver.position}</td>
                <td>
                    <a class="${driver.teamId}"
                       href="${driver.wikiLink}"
                       target="_blank"
                       rel="noopener noreferrer">
                        ${driver.firstName} ${driver.surName}
                    </a>
                </td>
                <td>${driver.nationality}</td>
                <td>${driver.team}</td>
                <td>${driver.points}</td>
            </tr>
        `;

        standingsHTML += driverHTML;
    });

    table.querySelector('tbody').innerHTML = standingsHTML;

    seasontitle.textContent =
        `Formula 1 Standings For ${season.season} Season, Current Round: ${season.round}`;

})();


// Toggle dark mode
function toggleDarkmode() {

    document.body.classList.toggle('darkmode');

}
