const db = require("../../components/database");
const AnnouncementVerification = db.announcements_verification;

/**
 * Create verification for announcement in the database
 * @param param Json object containing a announcement id and all key values pairs within the database
 */
exports.createVerification = (param) => {
    console.log("Store new announcement verification!");
    return AnnouncementVerification.create(param).then(data => {
        if(data){
            console.log("Stored new announcement with id: '"+ param.id +"' in database.");
            return data;
        } else {
            console.log("Error on storing new announcement with id: '"+ param.id +"' in database.");
            return 'Not created';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not created';
    });
};

/**
 * Find an announcement verification from the db by the id of the announcement
 * @param param Json object containing the id of the announcement verification
 */
exports.getVerification = (param) => {
    console.log("Get announcement verification by announcement id!");

    const aid = param.aid;

    return AnnouncementVerification.findOne({where: { aid: aid }}).then(data => {
        if(data){
            return data;
        } else {
            console.log("Could not find verification for announcement with id: '"+ param.id +"' in database.");
            return 'Not found';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not found';
    });
};





