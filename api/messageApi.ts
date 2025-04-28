import axios from "./axiosInstance";

// Message interfaces
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyName?: string;
}

export interface CreateMessageDto {
  receiverId: string;
  content: string;
}

// Message API functions
export const messageApi = {
  // Get all conversations for the current user
  getConversations: async () => {
    try {
      const response = await axios.get("/messages/conversations");
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },

  // Get chat history with a specific user
  getChatHistory: async (userId: string) => {
    try {
      const response = await axios.get(`/messages/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }
  },

  // Send a new message
  sendMessage: async (messageData: CreateMessageDto) => {
    try {
      const response = await axios.post("/messages", messageData);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Mark a message as read
  markAsRead: async (messageId: string) => {
    try {
      const response = await axios.post(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  },

  // Get unread message count
  getUnreadCount: async () => {
    try {
      const response = await axios.get("/messages/unread/count");
      return response.data;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  },
};

export default messageApi;
