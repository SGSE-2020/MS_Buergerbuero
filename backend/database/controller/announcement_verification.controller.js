const db = require("../../components/database");
const AnnouncementVerification = db.announcement_verification;

/**
 * Create verification for announcement in the database
 * @param param Json object containing a announcement id and all key values pairs within the database
 */
exports.createVerification = (param) => {
    return AnnouncementVerification.create(param).then(data => {
        if(data){
            return data;
        } else {
            return 'Not created';
        }
    }).catch(err => {
        return 'Not created';
    });
};

/**
 * Find an announcement verification from the db by the id of the announcement
 * @param param Json object containing the id of the announcement verification
 */
exports.getVerification = (param) => {
    const aid = param.aid;

    return AnnouncementVerification.findOne({where: { aid: aid }}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not found';
        }
    }).catch(err => {
        return 'Not found';
    });
};





