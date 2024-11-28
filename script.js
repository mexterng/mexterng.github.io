const username = "mexterng";
const repoList = document.getElementById("repo-list");
let blacklist = [];

async function fetchBlacklist() {
    try {
        const response = await fetch("blacklist.json");
        if (!response.ok) throw new Error("Fehler beim Abrufen der Blacklist.");
        blacklist = await response.json();
    } catch (error) {
        console.error("Fehler beim Laden der Blacklist:", error);
        blacklist = [];
    }
}

async function fetchRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) throw new Error("Fehler beim Abrufen der Repositories.");
        
        const repositories = await response.json();
        displayRepositories(repositories);
    } catch (error) {
        repoList.innerHTML = `<p>Fehler: ${error.message}</p>`;
    }
}

function displayRepositories(repos) {
    repoList.innerHTML = "";

    repos
        .filter(repo => !blacklist.includes(repo.name))
        .forEach(repo => {
            const repoItem = document.createElement("div");
            repoItem.className = "repo-item";
            repoItem.innerHTML = `
                <h2><a href="${repo.html_url}" target="_blank">${repo.name}</a></h2>
                <p>${repo.description || "Keine Beschreibung verfügbar."}</p>
            `;
            repoList.appendChild(repoItem);
        });

    if (repoList.innerHTML === "") {
        repoList.innerHTML = "<p>Keine Repositories zum Anzeigen verfügbar.</p>";
    }
}

async function initialize() {
    await fetchBlacklist();
    await fetchRepositories();
}

// load repos
initialize();
