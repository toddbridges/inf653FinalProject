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
    if(!req.body.funfacts) {
      return res.json({"message": 'State fun facts value required'});
    }
    
    const info = (req.body.funfacts);
    
    if(!Array.isArray(info)) {
        return res.json({"message": 'State fun facts value must be an array'});

    }
    
    var theInfo = [];
    for(var i in info)
      theInfo.push(info[i]);
    
    const input = (req.params.state).toUpperCase();
    
    try {
        
        const answer = await State.updateOne(
            { stateCode: input },
            {
                $push: {
                  funfacts: { $each: theInfo  }
                }
            }
        );
        delete answer.acknowledged;
        var janswer = JSON.stringify(answer);
        delete janswer.acknowledged;
        
        var newAns;
        for(var i = 0; i < 4; i++) {
          // newAns.push(answer[i]);
        }
        //console.log(newAns);
        res.status(201).json(JSON.parse(janswer));
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
    if(theState.length > 2) {
        res.json({"message": "Invalid state abbreviation parameter"});
      }
    
    var theAnswer = {};
    var index = -1;
    // 
    const mongState = await State.findOne({ stateCode: theState });
    // new is here
    const theFacts = await State.findOne({ stateCode: theState}, 'funfacts');
    // new ends here
    
    for(var i = 0; i < localStates.length; i++) {
        if(localStates[i].code == theState) {
            theAnswer = (localStates[i]);
        }
    }
    //if(!theFacts.funfacts) {
      //res.json(theAnswer);
    //}
    //if(theFacts.funfacts == null) {
      //res.json(theAnswer);
    //}
    if(theFacts.funfacts.length == 0) {
      
      res.json(theAnswer);
      
    } else {
      const len = theFacts.funfacts.length;
      if(len > 0) {
    theAnswer.funfacts = theFacts.funfacts; // This adds the MongoDB info to the object
    } 
      res.json(theAnswer);
    }
}

const getStateCapital = async (req, res) => {
    // console.log("at the get state captial part.");
    
    const input = await (req.params.state).toUpperCase();
    if(input.length > 2) {
        res.json({"message": "Invalid state abbreviation parameter"});
      }
    if(stateCodes.includes(input)) {
        let answer = {};
    
    for(let i = 0; i < data.states.length; i++) {
        if(data.states[i].code == input) {
            
            answer.state = data.states[i].state;
            answer.capital = data.states[i].capital_city;
            
        }
    }
    res.json(answer);
    } 
    
}
const getStateNickname = async (req, res) => {
    // console.log("at the get state nickname part.");
    
    const input = await (req.params.state).toUpperCase();
    if(input.length > 2) {
        return res.json({"message": "Invalid state abbreviation parameter"});
      }
    let answer = {};
    
    for(let i = 0; i < data.states.length; i++) {
        if(data.states[i].code == input) {
            answer.state = data.states[i].state;
            answer.nickname = data.states[i].nickname;
            
        }
    }
    
    return res.json(answer);
}

const getStatePopulation = (req, res) => {
    
    const input = (req.params.state).toUpperCase();
    if(input.length > 2) {
        return res.json({"message": "Invalid state abbreviation parameter"});
      }
    let answer = {};
    
    for(let i = 0; i < data.states.length; i++) {
        if(data.states[i].code == input) {
            answer.state = data.states[i].state;
            answer.population = (data.states[i].population).toLocaleString();
            
        }
    }
    res.json(answer);
}

const getStateAdmission = (req, res) => {
    
    const input = (req.params.state).toUpperCase();
    if(input.length > 2) {
        return res.json({"message": "Invalid state abbreviation parameter"});
      }
      
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
    /* if (!req.body?.funfacts || !req.body?.index) {
        return res.status(400).json({ 'message': 'index and funfacts are required' });
    } */

    if(!req.body.index) {
      return res.json({"message": 'State fun fact index value required'});
    }
    if(!req.body.funfact) {
      return res.json({"message": 'State fun fact value required'});
    }
    
    const arrayIndex = req.body.index;  // mongodb is zero based array indexing deleted -1
    const input = (req.params.state).toUpperCase(); // get the state code from url

    try {
        if(req.body.funfact) {
        const answer = await State.updateOne(
            { stateCode: input },
            { $set : { [`funfacts.${arrayIndex}`] : req.body.funfact }
                
            }
        );
        if(!State.findOne({stateCode: input}).funfacts) {
          return res.json({"message": "No Fun Facts found for Arizona"});
        }
          
        // new is below
        delete answer.acknowledged;
        var janswer = JSON.stringify(answer);
        delete janswer.acknowledged;
        
        var newAns;
        for(var i = 0; i < 4; i++) {
          // newAns.push(answer[i]);
        }
        //console.log(newAns);
        res.status(201).json(JSON.parse(janswer));
        
        
        //res.status(201).json(answer);
        }
    } catch (err) {
        // console.error(err);
    }

}

const deleteFunfact = async (req, res) => {
    
    if (!req.body.index) 
        return res.json({ 'message': 'State fun fact index value required' });
    

    const arrayIndex = req.body.index - 1;  // mongodb is zero based array indexing
    const input = (req.params.state).toUpperCase(); // get the state code from url
    try {
      var query = await State.findOne({ stateCode: input });
      if(query.funfacts.length == 0) {
        return res.json({ 'message': 'No Fun Facts found for Montana'});
      } else if(!query.funfacts[arrayIndex]) {
        return res.json({ 'message': 'No Fun Fact found at that index for Colorado'})
      } else
      
      
      query.funfacts.splice(arrayIndex, 1);
      
      State.updateOne({ stateCode: input }, {"$set": {"funfacts" : query}}); 

        res.status(201).json(query);
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
    if(theState.length > 2) {
        return res.json({"message": "Invalid state abbreviation parameter"});
      }
    var theAnswer = {};
    
    const mongState = await State.findOne({ stateCode: theState });
    if(mongState.funfacts.length == 0) {
      
      res.json({"message": "No Fun Facts found for Georgia"});
      
    } 
    const len = mongState.funfacts.length;
    
    theAnswer.funfact = mongState.funfacts[Math.floor(Math.random() * len)]; // This adds the MongoDB info to the object
    //console.log(typeof theAnswer);
    res.json(theAnswer);
    //const newAnswer = JSON.stringify(theAnswer);
    //console.log(typeof newAnwer);
    //console.log(newAnswer);
    //res.json(JSON.parse(newAnswer));
    
    
    
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