const Stone = require('../models/Stone');
const User = require('../models/User');

exports.create = (ownerId, treasureData) => Stone.create({ ...treasureData, owner: ownerId });

exports.getAll = () => Stone.find({}).lean(); //from documents to objects

exports.getOne = (treasureId) => Stone.findById(treasureId).lean();

exports.like = async (userId, treasureId) => {
    const treasure = await Stone.findById(treasureId); 
 
    treasure.likedList.push(userId);

    return await treasure.save();

    // Stone.findByIdAndUpdate(treasureId, { $push: { likedList: userId }}); 
}

exports.getOne = (treasureId) => Stone.findById(treasureId).lean();

exports.edit = (treasureId, treasureData) => Stone.findByIdAndUpdate(treasureId, treasureData, { runValidators: true });

exports.delete = (treasureId) => Stone.findByIdAndDelete(treasureId);

exports.search = async (name) => {
    let treasures = await this.getAll();

    if (name){
        treasures = treasures.filter(x => x.name.toLowerCase() == name.toLowerCase());
    }
    return treasures;
};

exports.getLatest = () => Stone.find().sort({createdAt: -1}).limit(3);