// creates a mapping for each TEAM_YEAR to info about the team
function populateTeams(teams) {
    var i = 0;
    var teamsKey;

    while (i < teams.length) {
        teamsKey = teams[i].teamID + "_" + teams[i].yearID
        teamsMap[teamsKey] = new teamValue(teams[i]);
        if (teams[i].yearID in yearsMap) {
            yearsMap[teams[i].yearID].teams.push(teams[i].teamID);
        } else {
            yearsMap[teams[i].yearID] = new yearsValue(teams[i].teamID);
        }
        
        if(allTeams.indexOf(teams[i].teamID) === -1) {
            allTeams.push(teams[i].teamID);
        }
        i++;
    }
}

// creates a mapping for each PLAYER to their first/last name
function populatePlayers(players) {
    var i = 0;

    while (i < players.length) {
        playersMap[players[i].playerID] = new indivPlayerValue(players[i]);
        i++;
    }
}

// creates a mapping for each PLAYER to their ERA if they were a pitcher
function populatePitching(pitching) {
    var i = 0;

    while (i < pitching.length) {
        teamsKey = pitching[i].teamID + "_" + pitching[i].yearID
        if (!(pitching[i].yearID in playersMap[pitching[i].playerID].years)) {
            playersMap[pitching[i].playerID].years[pitching[i].yearID] 
                = new playerYearsValue(pitching[i].teamID, null);                
        }

        playersMap[pitching[i].playerID].years[pitching[i].yearID].pitcher = true;
        playersMap[pitching[i].playerID].years[pitching[i].yearID].ERA = pitching[i].ERA;
        playersMap[pitching[i].playerID].years[pitching[i].yearID].IP = pitching[i].IPouts / 3;
        i++;
    }
}

// creates a mapping for each PLAYER to their AB information
function populateBatting(batting) {
    var i = 0;
    var S = 0;
    var NIBB = 0;

    while (i < batting.length) {
        teamsKey = batting[i].teamID + "_" + batting[i].yearID
        if (!(batting[i].yearID in playersMap[batting[i].playerID].years)) {
            playersMap[batting[i].playerID].years[batting[i].yearID] 
                = new playerYearsValue(batting[i].teamID, null);                
        }
        S = batting[i].H - batting[i].D - batting[i].T - batting[i].HR;
        NIBB = batting[i].BB - batting[i].IBB;

        playersMap[batting[i].playerID].years[batting[i].yearID].HR = batting[i].HR;
        playersMap[batting[i].playerID].years[batting[i].yearID].RBI = batting[i].RBI;
        playersMap[batting[i].playerID].years[batting[i].yearID].AB = batting[i].AB;
        playersMap[batting[i].playerID].years[batting[i].yearID].H = batting[i].H;

        playersMap[batting[i].playerID].years[batting[i].yearID].BA = 
            (batting[i].H / batting[i].AB).toFixed(3);
        playersMap[batting[i].playerID].years[batting[i].yearID].SLG = parseFloat(
            ((S + (2 * batting[i].D) + (3 * batting[i].T) + (4 * batting[i].HR))
            / batting[i].AB).toFixed(3));
        playersMap[batting[i].playerID].years[batting[i].yearID].OBP = parseFloat(
            ((parseInt(batting[i].H) + parseInt(batting[i].BB) + parseInt(batting[i].HBP)) 
            / (parseInt(batting[i].AB) + parseInt(batting[i].BB) + parseInt(batting[i].HBP) 
            + parseInt(batting[i].SF))).toFixed(3));
        playersMap[batting[i].playerID].years[batting[i].yearID].OBA = 
            (playersMap[batting[i].playerID].years[batting[i].yearID].SLG
            + playersMap[batting[i].playerID].years[batting[i].yearID].OBP).toFixed(3);

        // calculated per 2018 FanGraphs weighting formula 
        playersMap[batting[i].playerID].years[batting[i].yearID].wOBA = parseFloat(
            (((0.69 * NIBB) + (0.72 * parseInt(batting[i].HBP)) + (0.88 * S)
            + (1.247 * parseInt(batting[i].D)) + (1.578 * parseInt(batting[i].T))
            + (2.031 * parseInt(batting[i].HR))) / (parseInt(batting[i].AB)
            + NIBB + parseInt(batting[i].SF) + parseInt(batting[i].HBP))).toFixed(3));

        i++;
    }
}

// creates mappings for each TEAM_YEAR to players and for each PLAYER
// to info about each year they are in the league
function populateSalaries(salaries) {
    var i = 0;
    var oldTeam = salaries[i].teamID;
    var oldYear = salaries[i].yearID;

    while (i < salaries.length) {
        teamsKey = salaries[i].teamID + "_" + salaries[i].yearID
        teamsMap[teamsKey].players[salaries[i].playerID] = parseInt(salaries[i].salary);
        teamsMap[teamsKey].totSalaries += parseInt(salaries[i].salary);

        // records the average salary for the team once all salaries have been recorded
        if (oldTeam != salaries[i].teamID) {
            var tempKey = oldTeam + "_" + oldYear;
            teamsMap[tempKey].numPlayers = Object.keys(teamsMap[tempKey].players).length;
            teamsMap[tempKey].avgSalary = Math.round(teamsMap[tempKey].totSalaries 
                / teamsMap[tempKey].numPlayers);
            oldTeam = salaries[i].teamID;
            oldYear = salaries[i].yearID;
        } 

        // maps each PLAYER to corresponding info for each year
        if (!(salaries[i].yearID in playersMap[salaries[i].playerID].years)) {
            playersMap[salaries[i].playerID].years[salaries[i].yearID] 
                = new playerYearsValue(salaries[i].teamID, salaries[i].salary);                
        } else {
            playersMap[salaries[i].playerID].years[salaries[i].yearID].salary = salaries[i].salary;
        }

        // TODO: NOT CURRENTLY DEALING WITH DUPLICATES
        if (yearsMap[salaries[i].yearID].players.indexOf(salaries[i].playerID) === -1) {
            yearsMap[salaries[i].yearID].players.push(salaries[i].playerID);
        }
        // } else {
        //     console.log("duplicate: " + salaries[i].playerID);
        //     console.log(salaries[i].yearID);
        // }
        
        i++;
    }
}

// maps all-star appearances (including starting) to each TEAM_YEAR
// and corresponding player
function populateAllStars(allstars) {
    var i = 0;
    
    while (i < allstars.length - 1) {
        teamsKey = allstars[i].teamID + "_" + allstars[i].yearID;

        // handles errors in db where ID is not correctly inputted
        if (allstars[i].teamID == "MLN" && !(teamsKey in teamsMap)) {
            teamsKey = "ML1_" + allstars[i].yearID;
        } else if (allstars[i].teamID == "MIL" && !(teamsKey in teamsMap)) {
            teamsKey = "ML4_" + allstars[i].yearID;
        } else if (allstars[i].teamID == "LAA" && !(teamsKey in teamsMap)) {
            teamsKey = "ANA_" + allstars[i].yearID;
        } else if (allstars[i].teamID == "WSN" && !(teamsKey in teamsMap)) {
            teamsKey = "WAS_" + allstars[i].yearID;
        } 
        if (teamsKey in teamsMap) {
            teamsMap[teamsKey].allStars.push(allstars[i].playerID)

            // handles years prior to 1985 before salary data was first recorded 
            if (!(allstars[i].yearID in playersMap[allstars[i].playerID].years)) {
                playersMap[allstars[i].playerID].years[allstars[i].yearID] 
                    = new playerYearsValue(teamID, null);
            }
            playersMap[allstars[i].playerID].years[allstars[i].yearID].allStar = true;

            // checks for starting pos in all star game
            if ((parseInt(allstars[i].startingPos)) < 11) {
                teamsMap[teamsKey].startingAllStars.push(allstars[i].playerID);
                playersMap[allstars[i].playerID].years[allstars[i].yearID].allStarStart = true;
            }
        }
        i++;
    }
}