const catchAsyncHandler = require("../utils/catchAsyncHandler");
const ConversationService = require("../services/chat.service");

class ConversationController {
  static createConversation = catchAsyncHandler(async (req, res) => {
    const { user1, user2 } = req.body;
    const conversation = await ConversationService.createConversation(
      user1,
      user2
    );
    res.status(200).json({ success: true, conversation });
  });

  static sendMessage = catchAsyncHandler(async (req, res) => {

    const { conversationId, message, file, receiverId } = req.body;
    console.log("req.body", req.body);
    console.log("conversationId112233", conversationId);
    const senderId = req.user.id;
    const newMessage = await ConversationService.sendMessage(
      conversationId,
      senderId,
      receiverId,
      message,
      file
    );
    res.status(201).json({ success: true, data: newMessage });
  });

  static getUserConversations = catchAsyncHandler(async (req, res) => {
    const userId = req.user.id;
    const conversations = await ConversationService.fetchConversation(
      userId
    );
    res.status(200).json({ success: true, conversations });
  });

  static fetchConversation = catchAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const messages = await ConversationService.fetchConversation(
      //currentUserId,
      userId
    );
    res.status(200).json({ success: true, data: messages });
  });

  static getConversationMessages = catchAsyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const messages = await ConversationService.getConversationMessages(
      conversationId
    );
    res.status(200).json({ success: true, messages });
  });

  static updateMessage = catchAsyncHandler(async (req, res) => {
    const { conversationId, messageId } = req.params;
    const { newText } = req.body;
    const updatedMessage = await ConversationService.updateMessage(
      conversationId,
      messageId,
      newText
    );
    res.status(200).json({ success: true, updatedMessage });
  });

  static deleteMessage = catchAsyncHandler(async (req, res) => {
    const { conversationId, messageId } = req.params;
    const result = await ConversationService.deleteMessage(
      conversationId,
      messageId
    );
    res.status(200).json(result);
  });

  static deleteConversation = catchAsyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const result = await ConversationService.deleteConversation(conversationId);
    res.status(200).json(result);
  });
}

module.exports = ConversationController;
