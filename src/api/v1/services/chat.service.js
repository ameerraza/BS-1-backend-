const Conversation = require("../model/Chat");
const AppError = require("../utils/AppError");
const HttpStatusCodes = require("../enums/httpStatusCode");
const SocketService = require("../sockets/socket.service");

class ConversationService {
  /**
   * Create a new conversation between two users
   */
  static async createConversation(user1, user2) {
    const existingConversation = await Conversation.findOne({
      participants: { $all: [user1, user2] },
    });

    if (existingConversation) return existingConversation;

    const newConversation = new Conversation({
      participants: [user1, user2],
      messages: [],
    });

    await newConversation.save();
    return newConversation;
  }

  /**
   * Send a message in an existing conversation
   */
  static async sendMessage(
    conversationId,
    senderId,
    receiverId,
    message,
    file = ""
  ) {
    console.log("conversationId", conversationId);
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new AppError("Conversation not found.", HttpStatusCodes.NOT_FOUND);
    }

    console.log("conversation", conversation);

    const newMessage = {
      sender: senderId,
      receiver: receiverId,
      message: message,
      file,
      read: false,
    };

    conversation.messages.push(newMessage);
    // Emit socket event to the receiver
    SocketService.emitMessageToUser(newMessage?.receiver, newMessage);
    await conversation.save();

    return {
      message: "Message sent successfully.",
      success: true,
      newMessage,
    };
  }

  

  /**
   * Add a new message to an existing conversation
   */
  static async addMessage(
    conversationId,
    sender,
    receiver,
    messageText,
    file = null
  ) {
    console.log("conversationId", conversationId);
    const conversation = await Conversation.findById(conversationId);

    if (!conversation)
      throw new AppError("Conversation not found.", HttpStatusCodes.NOT_FOUND);

    const newMessage = {
      sender,
      receiver,
      message: messageText,
      file,
      read: false,
    };

    conversation.messages.push(newMessage);
    await conversation.save();
    SocketService.emitMessageToUser(newMessage.receiver, newMessage);
    return conversation;
  }

  /**
   * Get all conversations for a specific user
   */
  static async fetchConversation(userId) {
    console.log("userId", userId);
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name email")
      .populate("messages.sender", "name email id")
      .populate("messages.receiver", "name email id")
      .sort({ updatedAt: -1 });

    return {
      message: "Conversations retrieved successfully.",
      success: true,
      conversations,
    };
  }

  /**
   * Get all messages in a conversation
   */
  static async getConversationMessages(conversationId) {
    const conversation = await Conversation.findById(conversationId)
      .populate("messages.sender", "name email")
      .populate("messages.receiver", "name email");

    if (!conversation)
      throw new AppError("Conversation not found.", HttpStatusCodes.NOT_FOUND);

    return {
      message: "Messages retrieved successfully.",
      success: true,
      messages: conversation.messages,
    };
  }

  /**
   * Update a specific message in a conversation
   */
  static async updateMessage(conversationId, messageId, newText) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation)
      throw new AppError("Conversation not found.", HttpStatusCodes.NOT_FOUND);

    const message = conversation.messages.id(messageId);
    if (!message)
      throw new AppError("Message not found.", HttpStatusCodes.NOT_FOUND);

    message.message = newText;
    await conversation.save();

    return {
      message: "Message updated successfully.",
      success: true,
      updatedMessage: message,
    };
  }

  /**
   * Delete a specific message from a conversation
   */
  static async deleteMessage(conversationId, messageId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation)
      throw new AppError("Conversation not found.", HttpStatusCodes.NOT_FOUND);

    conversation.messages = conversation.messages.filter(
      (msg) => msg._id.toString() !== messageId
    );
    await conversation.save();

    return { message: "Message deleted successfully.", success: true };
  }

  /**
   * Delete an entire conversation
   */
  static async deleteConversation(conversationId) {
    const deleted = await Conversation.findByIdAndDelete(conversationId);
    if (!deleted)
      throw new AppError("Conversation not found.", HttpStatusCodes.NOT_FOUND);

    return { message: "Conversation deleted successfully.", success: true };
  }
}

module.exports = ConversationService;
