function teamValue(data) {
    this.year = data.yearID;
    this.leagueID = data.lgID;
    this.teamID = data.teamID;
    this.franchiseID = data.franchID;
    this.divID = data.divID;
    this.divRank = data.Rank;
    this.games = data.G;
    this.homeGames = data.Ghome;
    this.wins = data.W;
    this.loses = data.L;
    this.divWin = data.DivWin;
    this.WCWin = data.WCWin;
    this.leagueWin = data.LgWin;
    this.WSWin = data.WSWin;
    this.fullName = data.name;
    this.homeField = data.park;
    this.homeAttendance = data.attendance;
    this.avgAttendance = Math.round(data.attendance/data.Ghome);
    this.players = {};
    this.totSalaries = 0;
    this.avgSalary = 0;
    this.numPlayers = 0;
    this.allStars = [];
    this.startingAllStars = [];
    this.topPlayers = {};
    this.starValue = 0;
    this.success = data.W;
}

function indivPlayerValue(data) {
    this.firstName = data.nameFirst;
    this.lastName = data.nameLast;
    this.years = {};
}

function playerYearsValue(team, salary) {
    this.team = team;
    this.salary = salary;
    this.BA = 0;
    this.AB = 0;
    this.H = 0;
    this.RBI = 0;
    this.HR = 0;
    this.SLG = 0;
    this.OBP = 0;
    this.OBA = 0;
    this.wOBA = 0;
    this.allStar = false;
    this.allStarStart = false;
    this.pitcher = false;
    this.ERA = null;
    this.IP = null;
}

function yearsValue(team) {
    this.teams = [team];
    this.players = [];
    this.BAThreshold = 0;
    this.ERAThreshold = 0;
    this.topPlayers = [];
}