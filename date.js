module.exports.getdate =
    function () {
        const today = new Date();
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }
        return today.toLocaleDateString("en-Us", options);

    }
module.exports.getday =
    function () {
        const today = new Date();
        const options = {
            weekday: 'long',

        }
        return day = today.toLocaleDateString("en-Us", options);

    }