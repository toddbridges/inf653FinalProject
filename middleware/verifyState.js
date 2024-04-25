const stateCodes = [];
const j = require('../model/statesData.json');

for(var i in j) {
    var item = j[i];
    stateCodes.push(item.code);
}

const verifyState = (req, res, next) => {
    console.log("in the verify function...");
    const input = (req.params.state).toUpperCase();
    var ans = 0;
    if(stateCodes.includes(input)) {
        console.log("the state does exist");
        req.code = input;
        ans = 1;
    } else {
        return ans;
    }
    return ans;
}

module.exports = verifyState;