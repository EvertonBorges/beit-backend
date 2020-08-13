const mongoose = require('mongoose');
const Users = mongoose.model('User');

exports.create = async data => {
    const user = new Users(data);
    await user.save();
}

exports.update = async (id, data) => {
    const user = await Users.findById(id);
    
    if (!data.fullName) {
        data.fullName = user.fullName;
    }

    if (!data.birthDate) {
        data.birthDate = user.birthDate;
    }

    await Users.findByIdAndUpdate(id, {
        $set: {
            fullName: data.fullName,
            birthDate: data.birthDate,
            date_update: data.date_update,
        }
    });
}

exports.updatePassword = async (id, data) => {
    await Users.findByIdAndUpdate(id, {
        $set: {
            password: data.password,
            date_update: data.date_update,
        }
    });
}

exports.updateEmail = async (id, data) => {
    await Users.findByIdAndUpdate(id, {
       $set: {
           email: data.email,
           date_update: data.date_update,
       } 
    });
}

exports.delete = async id => {
    await Users.findByIdAndUpdate(id, {
        $set: {
            status: false,
        }
    });
}

exports.find = async data => {
    return await Users.findOne(data);
}

exports.findById = async id => {
    return await Users.findById(id);
}