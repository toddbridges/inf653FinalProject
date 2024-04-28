const express = require('express');
const router = express.Router();
const path = require('path');
const statesController = require('../../controllers/statesController');


router.route('/?contig=true')  // might have to make this =true
    .get(statesController.getContigStates);

router.route('/')
    .get(statesController.getAllStates)
    .post(statesController.createNewStateFunfact)
    .put(statesController.updateFunfacts)  // got rid of word updateStateFunfact
    .delete(statesController.deleteFunfact);

//router.route('/:state/funfacts')
    //.get();


// if there is a parameter directly in the URL
// get request with a named parameter



router.route('/:state') // changed from :id
    .get(statesController.getState);

router.route('/:state/capital')
    .get(statesController.getStateCapital);

router.route('/:state/nickname')
    .get(statesController.getStateNickname);

router.route('/:state/population')
    .get(statesController.getStatePopulation);

router.route('/:state/admission')
    .get(statesController.getStateAdmission);

router.route('/:state/funfact')
    .post(statesController.createNewStateFunfact)
    .patch(statesController.updateFunfacts)
    .delete(statesController.deleteFunfact)
    .get(statesController.randomFunfact);



module.exports = router;