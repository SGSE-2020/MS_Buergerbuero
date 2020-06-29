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
        console.error("DB ERROR: " + err);
        return 'Not created';
    });
};

/**
 * Delete an announcement verification
 * @param param Id of the announcement verification
 */
exports.delete = (param) => {
    return AnnouncementVerification.destroy({where: { id: param }}).then(data => {
        return 'Deleted';
    }).catch(err => {
        console.error("DB ERROR: " + err);
        return 'Not deleted';
    });
};





