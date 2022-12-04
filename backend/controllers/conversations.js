const Conversation = require("../models/Conversation")

exports.newConversation=async(req,res)=>{
    try {
        const newConversations = new Conversation({
            members:[req.body.senderId,req.body.recieverId]
        })
        const savedConversation = await newConversations.save();
        res.json(savedConversation)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
exports.getConversation=async(req,res)=>{
    try {
        const conversation = await Conversation.find({members:{$in:[req.params.userId]}})
        res.json(conversation)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
exports.findChat = async (req,res)=>{
    try {
        const chat = await Conversation.findOne({
            members:{$all:[req.params.firstId,req.params.secondId]}
        })
        res.json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}