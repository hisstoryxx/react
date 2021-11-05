// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageStatus = {
  "SENT": "SENT",
  "DELIVERED": "DELIVERED",
  "READ": "READ"
};

const { User, Message, ChatRoomUser, ChatRoom } = initSchema(schema);

export {
  User,
  Message,
  ChatRoomUser,
  ChatRoom,
  MessageStatus
};