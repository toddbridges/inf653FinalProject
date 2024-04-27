// This is from the static file
const data = {};
data.states = require('../model/statesData.json');

//This is from the Mongo database
const State = require('../model/State.js');
const verifyState = require('../middleware/verifyState.js');

const stateCodes = [];
const j = require('../model/statesData.json');

for(var i in j) {
    var item = j[i];
    stateCodes.push(item.code);
}


const getAllStates = async (req,res) => {

    const contig = req.query.contig;
    
    if(contig == undefined) {  //  return all states data

        
        const states = await State.find();
        // if (!states) return res.status(204).json({'message': 'No states found.'})

        const key = "funfacts";

        let num = 0;
        for(i in data.states) {
            (data.states[i])[key] = states[num++].funfacts; 
        }
        res.json(data.states); 
    } else if(contig == 'true') {  // all states but alaska and hawaii
        //console.log('we are at contig true');
        //console.log(contig);
        /* if(contig === false) {
            console.log("contig is false");
        } */
        const states = await State.find();
        // if (!states) return res.status(204).json({'message': 'No states found.'})

        const key = "funfacts";

        let num = 0;
        for(i in data.states) {
            (data.states[i])[key] = states[num++].funfacts; 
        }
        const statearray = data.states.filter(function( obj ) { 
            return obj.code !== 'AK' && obj.code != 'HI'});

        res.json(statearray); 

    } else if (contig == 'false') {  // just alaska and hawaii

        // console.log("we are here");
        const states = await State.find();
        // if (!states) return res.status(204).json({'message': 'No states found.'})

        const key = "funfacts";

        let num = 0;
        for(i in data.states) {
            (data.states[i])[key] = states[num++].funfacts; 
        }

        const statearray = data.states.filter(function( obj ) { 
            return obj.code === 'AK' || obj.code === 'HI'});
        res.json(statearray); 
        
    }
}

const createNewStateFunfact = async (req, res) => {
    
    const info = (req.body)
    
    var theInfo = [];
    for(let i = 0; i < info.funfacts.length; i++) {
        theInfo.push(info.funfacts[i]);
    }


    const input = (req.params.state).toUpperCase();
    // const theState = req.body.stateCode;

    try {
        
        const answer = await State.updateOne(
            { stateCode: input },
            {
                $push: {
                  funfacts: { $each: theInfo  }
                }
                
            }
        );
        

        //console.log(result);
        res.status(201).json(answer);
    } catch (err) {
        console.error(err);
    }
}

const updateStateFunfact = (req, res) => {
    res.json({
        "firstname": req.body.firstname,
        "lastname": req.body.lastname
    });
}


const getState = async (req, res) => {
    const localStates = data.states;
    
    const theState = (req.params.state).toUpperCase();
    
    var theAnswer = {};
    var index = -1;
    const mongState = await State.findOne({ stateCode: theState });
    
    for(var i = 0; i < localStates.length; i++) {
        if(localStates[i].code == theState) {
            theAnswer = (localStates[i]);
        }
    }
    
    theAnswer['funfacts'] = mongState.funfacts; // This adds the MongoDB info to the object
    
    res.json(theAnswer);
    
    // console.log("the test is here");
}

const getStateCapital = (req, res) => {
    // console.log("at the get state captial part.");
    
    const input = (req.params.state).toUpperCase();
    if(stateCodes.includes(input)) {
        let answer = {};
    
    for(let i = 0; i < data.states.length; i++) {
        if(data.states[i].code == input) {
            
            answer.state = data.states[i].state;
            answer.capital = data.states[i].capital_city;
            
        }
    }
    res.json(answer);
    } else {
        res.json({"message": "Invalid state abbreviation parameter"})
    }
    
}
const getStateNickname = (req, res) => {
    // console.log("at the get state nickname part.");
    
    const input = (req.params.state).toUpperCase();

    if(stateCodes.includes(input)) {
        let answer = {};
    
    for(let i = 0; i < data.states.length; i++) {
        if(data.states[i].code == input) {
            
            answer.state = data.states[i].state;
            answer.nickname = data.states[i].nickname;
            
        }
    }
    res.json(answer);
    } else {
        res.json({"message": "Invalid state abbreviation parameter"})
    }
}

const getStatePopulation = (req, res) => {

    const input = (req.params.state).toUpperCase();
    if(stateCodes.includes(input)) {
        let answer = {};
    
    for(let i = 0; i < data.states.length; i++) {
        if(data.states[i].code == input) {
            
            answer.state = data.states[i].state;
            answer.population = (data.states[i].population).toLocaleString();
            
        }
    }
    res.json(answer);
    } else {
        res.json({"message": "Invalid state abbreviation parameter"})
    }
}

const getStateAdmission = (req, res) => {
    
    const input = (req.params.state).toUpperCase();
    let answer = {};
    
    for(let i = 0; i < data.states.length; i++) {
        if(data.states[i].code == input) {
            answer.state = data.states[i].state;
            answer.admitted = data.states[i].admission_date;
            
        }
    }
    res.json(answer);
}

const updateFunfacts = async (req, res) => {
    if (!req.body?.funfacts || !req.body?.index) {
        return res.status(400).json({ 'message': 'index and funfacts are required' });
    }

    const arrayIndex = req.body.index - 1;  // mongodb is zero based array indexing
    const input = (req.params.state).toUpperCase(); // get the state code from url

    try {

        const answer = await State.updateOne(
            { stateCode: input },
            { $set : { [`funfacts.${arrayIndex}`] : req.body.funfacts }
                
            }
        );
        
        res.status(201).json(answer);
    } catch (err) {
        console.error(err);
    }

}

const deleteFunfact = async (req, res) => {
    if (!req.body?.index) {
        return res.status(400).json({ 'message': 'index is required' });
    }

    const arrayIndex = req.body.index - 1;  // mongodb is zero based array indexing
    const input = (req.params.state).toUpperCase(); // get the state code from url
    var key = "tobePulled";

    try {

        await State.updateOne(
            { stateCode: input },
            { $set : { [`funfacts.${arrayIndex}`] : key }
            }
        );

        const answer = await State.updateOne(
            { stateCode: input },
            { $pull : { funfacts: key }
                
            }
        );
        
        res.status(201).json(answer);
    } catch (err) {
        console.error(err);
    }
}


const getContigStates = async (req,res) => {
    console.log("In the contig part");
    const contigAnswer = req.query.contig;
    console.log("The contig is " + contigAnswer);
} 

const randomFunfact = async (req, res) => {
    
    const theState = (req.params.state).toUpperCase();
    var theAnswer = {};
    
    const mongState = await State.findOne({ stateCode: theState });
    
    theAnswer['funfact'] = mongState.funfacts[Math.floor(Math.random() * mongState.funfacts.length)]; // This adds the MongoDB info to the object
    
    res.json(theAnswer);
    
    
}

module.exports = {
    getAllStates,
    createNewStateFunfact,
    updateStateFunfact, 
    deleteFunfact,
    getState,
    getStateCapital, 
    getStateNickname, 
    getStatePopulation, 
    getStateAdmission, 
    updateFunfacts,
    getContigStates, 
    randomFunfact
}