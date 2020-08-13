const moment = require('moment');
moment.locale('pt-br');

exports.parseStringInternationalStringToDate = (date) => {
    return moment(date, "YYYY-MM-DD");
}

exports.parseStringNationalStringToDate = (date) => {
    return moment(date, "DD/MM/YYYY");
}

exports.formatDateToInternationalString = (date) => {
    return moment(date).format('YYYY-MM-DD');
}

exports.formatDateToNationalString = (date) => {
    return moment(date).format('DD/MM/YYYY');
}