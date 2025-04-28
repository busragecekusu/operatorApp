import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import messageApi, { Message, CreateMessageDto } from "@/api/messageApi";
import Toast from "react-native-toast-message";

interface MessageState {
  conversations: Array<{
    userId: string;
    userName: string;
    companyName: string;
    lastMessage: string;
    lastMessageDate: string;
    unreadCount?: number;
  }>;
  messages: Message[];
  currentChat: string | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  conversations: [],
  messages: [],
  currentChat: null,
  unreadCount: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      return await messageApi.getConversations();
    } catch (error) {
      return rejectWithValue("Failed to fetch conversations");
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  "messages/fetchChatHistory",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await messageApi.getChatHistory(userId);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch chat history";
      // Show error toast for approved request requirement
      if (errorMessage.includes("approved request")) {
        Toast.show({
          type: "error",
          text1: "Cannot view messages",
          text2: "You can only message users with approved requests",
        });
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData: CreateMessageDto, { rejectWithValue }) => {
    try {
      return await messageApi.sendMessage(messageData);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send message";
      // Show error toast for approved request requirement
      if (errorMessage.includes("approved request")) {
        Toast.show({
          type: "error",
          text1: "Cannot send message",
          text2: "You can only message users with approved requests",
        });
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (messageId: string, { rejectWithValue }) => {
    try {
      return await messageApi.markAsRead(messageId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark message as read"
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "messages/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      return await messageApi.getUnreadCount();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChat = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = null;
      state.messages = [];
    },
    // Reset unread count when user is viewing messages
    resetUnreadCountForUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      // Find the conversation and update its unread count
      const convoIndex = state.conversations.findIndex(
        (c) => c.userId === userId
      );
      if (convoIndex !== -1) {
        state.conversations[convoIndex].unreadCount = 0;

        // Recalculate total unread count
        state.unreadCount = state.conversations.reduce(
          (total: number, convo: { unreadCount?: number }) =>
            total + (convo.unreadCount || 0),
          0
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Handle fetchConversations
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.loading = false;
      state.conversations = action.payload;

      // Update the unread count based on all conversations
      state.unreadCount = action.payload.reduce(
        (total: number, convo: { unreadCount?: number }) =>
          total + (convo.unreadCount || 0),
        0
      );
    });
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle fetchChatHistory
    builder.addCase(fetchChatHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChatHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    });
    builder.addCase(fetchChatHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle sendMessage
    builder.addCase(sendMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.messages.push(action.payload);
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle markMessageAsRead
    builder.addCase(markMessageAsRead.fulfilled, (state, action) => {
      const updatedMessage = action.payload;
      const index = state.messages.findIndex(
        (msg) => msg.id === updatedMessage.id
      );
      if (index !== -1) {
        state.messages[index].isRead = true;
      }
    });

    // Handle fetchUnreadCount
    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload;
    });
  },
});

export const { setCurrentChat, clearCurrentChat, resetUnreadCountForUser } =
  messageSlice.actions;

export default messageSlice.reducer;
