const Message = require("../models/Message");

exports.AddNewMessage = async (req, res) => {
  try {
    console.log(req.body)
    const { sender, text, conversationId } = req.body;
    const message = new Message({
      sender,
      text,
      conversationId,
    });
    const savedMessage = await await message.save();
    res.json(savedMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};
