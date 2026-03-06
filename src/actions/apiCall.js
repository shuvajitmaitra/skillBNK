import axios from 'axios';
import {showToast} from '../components/HelperFunction';
import store from '../store';
import {
  initialActivities,
  setActivitiesCount,
} from '../store/reducer/activitiesReducer';
import {selectOrganizations, setNavigation} from '../store/reducer/authReducer';
import {
  setOnlineUsers,
  setSingleChat,
  setSingleMessage,
  updateChatsArchive,
  updateFavoriteSingleChat,
  updateLatestMessage,
  updateMyData,
  updateSingleChatArchive,
  updateSingleChatMemberCount,
} from '../store/reducer/chatReducer';
import {
  setChatMemberInfo,
  setCrowdMembers,
  setLocalMessages,
  setSelectedMembers,
  setThreadMessages,
  updateDeletedMessage,
  updateEmoji,
  updateThreadMessage,
} from '../store/reducer/chatSlice';
import {setCalendar, setMockInterview} from '../store/reducer/dashboardReducer';
import {
  setNotificationCount,
  setNotifications,
} from '../store/reducer/notificationReducer';
import axiosInstance from '../utility/axiosInstance';
import {
  addArrayToObject,
  getArrayFromLocalStorage,
  saveObjectToLocalStorage,
  saveToMMKV,
} from '../utility/mmkvHelpers';
import {mStore} from '../utility/mmkvStoreName';
// import {setOrganization} from '../utility/mmkvHelpers';
import {handleError, loadChats} from './chat-noti';
const rolePriority = {
  owner: 1,
  admin: 2,
  moderator: 3,
  member: 4,
};

// Function to determine mute/block priority
const getMuteBlockPriority = member => {
  const isMuted = member.mute.isMuted;
  const isBlocked = member.isBlocked;

  if (isBlocked && isMuted) {
    return 4;
  } // Last: Both Blocked & Muted
  if (isBlocked) {
    return 3;
  } // Second last: Only Blocked
  if (isMuted) {
    return 2;
  } // Third last: Only Muted
  return 1; // Higher priority
};

// Sorting function
const sortCrowdMembers = members => {
  return members.sort((a, b) => {
    // Sort by role priority first
    const roleDiff = rolePriority[a.role] - rolePriority[b.role];
    if (roleDiff !== 0) {
      return roleDiff;
    }

    // If same role, sort by mute/block priority
    return getMuteBlockPriority(a) - getMuteBlockPriority(b);
  });
};

export const userOrganizationInfo = async () => {
  await axiosInstance
    .get('/organization/user-organizations')
    .then(res => {
      store.dispatch(selectOrganizations(res.data.organizations));
      // if (res.data.organizations.length === 1) {
      //   // setOrganization(res.data.organizations[0]);
      //   // store.dispatch(setSelectedOrganization(res.data.organizations[0]));
      // }
    })
    .catch(error => {
      console.log(
        'error to get organization data',
        JSON.stringify(error.response.data, null, 1),
      );
    });
};
export const handleChatFavorite = data => {
  showToast({
    message: data.isFavourite
      ? 'Added to favorite list'
      : 'Removed from favorite list',
  });
  axiosInstance
    .put('/chat/favourite', data)
    .then(res => {
      if (res.data.success) {
        store.dispatch(
          updateMyData({
            field: 'isFavourite',
            value: res.data.member.isFavourite,
            _id: data.chat,
          }),
        );
        store.dispatch(
          updateFavoriteSingleChat({
            isFavourite: res.data.member.isFavourite,
          }),
        );
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const loadCrowdMember = chatId => {
  console.log('load crowd member called--------------------------------------');
  axiosInstance
    .post(`/chat/members/${chatId}`)
    .then(res => {
      const filtered =
        res?.data?.results
          ?.filter(x => x?._id && x.user._id !== store.getState().auth.user._id)
          .map(({user}) => ({
            id: user?._id,
            name: user?.fullName || '',
            email: user?.email || '',
            username: user?.fulllName || '',
            profilePicture: user?.profilePicture || '',
          })) || [];
      store.dispatch(setCrowdMembers(res.data.results));
      const crowdMembers = getArrayFromLocalStorage('crowdMembers');
      const members = {...crowdMembers, [chatId]: filtered};
      saveObjectToLocalStorage('crowdMembers', members);
    })
    .catch(error => {
      console.log(
        'getting error to fetch member',
        JSON.stringify(error, null, 1),
      );
    });
};

export const getMessage = async (chatId, chat) => {
  const options = {
    page: 0,
    chat: chatId,
    limit: 15,
  };
  try {
    const res = await axiosInstance.post('/chat/messages', options);

    const newMessages = res.data.messages.reverse();

    store.dispatch(setLocalMessages(newMessages));
  } catch (error) {
    console.log(
      'Error loading initial messages:',
      JSON.stringify(error.response.data.error, null, 1),
    );
    showToast({
      message: error.response.data.error,
    });
    if (error.response.data.error === 'Channel is listed as archived') {
      store.dispatch(setSingleChat({...chat, isArchived: true}));
    }
  } finally {
    console.log('initial Message Calling completed');
  }
};
export const fetchMembers = info => {
  // console.log('info', JSON.stringify(info, null, 2));
  if (!info.chatId) {
    showToast({message: 'Chat Id is not available'});
  }
  if (!info.page) {
    showToast({message: 'Page is not available'});
  }
  if (!info.limit) {
    showToast({message: 'Limit is not available'});
  }

  axiosInstance
    .post(`/chat/members/${info?.chatId}`, {
      page: info.page,
      query: '',
      limit: info.limit,
    })
    .then(res => {
      store.dispatch(setChatMemberInfo({...info, ...res.data.pagination}));

      if (info.page === 1) {
        const crM = sortCrowdMembers(res.data.results);
        store.dispatch(setCrowdMembers(crM));
        console.log('Fetch memebr called');
        addArrayToObject({
          storeName: mStore.ALL_CROWDS_MEMBERS,
          key: info.chatId,
          value: crM,
        });
      } else {
        const crM = sortCrowdMembers([
          ...res.data.results,
          ...getArrayFromLocalStorage(mStore.ALL_CROWDS_MEMBERS)[info.chatId],
        ]);
        store.dispatch(setCrowdMembers(crM));
        console.log('Fetch memebr called');
        addArrayToObject({
          storeName: mStore.ALL_CROWDS_MEMBERS,
          key: info.chatId,
          value: crM,
        });
      }
      // console.log(
      //   'res.data.results',
      //   JSON.stringify(res.data.results, null, 1),
      // );
    })
    .catch(error => {
      console.log(
        'getting error to fetch member',
        JSON.stringify(error.response.data.error, null, 1),
      );
    });
};

export const handleUpdateMember = actionData => {
  // {
  //   member: item?._id,
  //   chat: item?.chat,
  //   actionType: 'block',
  // }

  console.log('actionData', JSON.stringify(actionData, null, 2));
  axiosInstance
    .post('/chat/member/update', actionData)
    .then(res => {
      if (res.data?.success) {
        if (actionData.actionType === 'role') {
          showToast({message: `Role assigned as ${actionData.role}`});
        }
        if (
          actionData.actionType === 'mute' ||
          actionData.actionType === 'unmute'
        ) {
          showToast({
            message: `Member ${actionData.actionType}d successfully`,
          });
        }
        if (
          actionData.actionType === 'block' ||
          actionData.actionType === 'Unblock'
        ) {
          showToast({
            message: `Member ${String(
              actionData.actionType,
            ).toLocaleLowerCase()}ed successfully`,
          });
        }

        fetchMembers({chatId: actionData.chat, limit: 5, page: 1});

        //   console.log("item", item);
        store.dispatch(setSelectedMembers({}));
      }
    })
    .catch(error => {
      console.log(
        'Chat member update:',
        JSON.stringify(error.response.data, null, 1),
      );
    });
};

export const handleArchive = async data => {
  // console.log('Data passed to handleArchive:', JSON.stringify(data, null, 1));
  showToast({
    message: data.archived
      ? 'Crowd archived successfully!'
      : 'Crowd unarchive successfully!',
  });
  await axiosInstance
    .patch(`/chat/channel/archive/${data.chatId}`, {
      isArchived: data.archived,
    })
    .then(res => {
      if (res.data.success) {
        store.dispatch(
          updateChatsArchive({
            _id: data.chatId,
            field: 'isArchived',
            value: data.archived,
          }),
        );
        store.dispatch(updateSingleChatArchive({isArchived: data.archived}));
      }
    })
    .catch(error => {
      console.log('Error archiving chat:', JSON.stringify(error, null, 1));
    });
};

export const handleRemoveUser = member => {
  console.log('memberId', JSON.stringify(member, null, 2));
  //   {
  //     "_id": "681467fd4e3bb3001a43e27c",
  //     "mute": {
  //       "isMuted": false
  //     },
  //     "notification": {
  //       "isOn": true
  //     },
  //     "isBlocked": false,
  //     "isFavourite": false,
  //     "role": "member",
  //     "chat": "6757dc88678506001a0b6527",
  //     "user": {
  //       "_id": "661de4ac7297c500235a7076",
  //       "firstName": "Sagor",
  //       "lastName": "Ahamed",
  //       "profilePicture": "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/1713235678050-unnamed.JPEG",
  //       "lastActive": "2025-05-02T02:00:33.726Z",
  //       "fullName": "Sagor Ahamed"
  //     },
  //     "createdAt": "2025-05-02T06:36:45.702Z",
  //     "updatedAt": "2025-05-02T06:36:45.702Z",
  //     "__v": 0
  //   }

  //   {
  //     "_id": "681464804e3bb3001a43e1b9",
  //     "mute": {
  //         "isMuted": false
  //     },
  //     "notification": {
  //         "isOn": true
  //     },
  //     "isBlocked": false,
  //     "isFavourite": false,
  //     "role": "member",
  //     "chat": "6757dc88678506001a0b6527",
  //     "user": {
  //         "_id": "661de4ac7297c500235a7076",
  //         "firstName": "Sagor",
  //         "lastName": "Ahamed",
  //         "profilePicture": "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/1713235678050-unnamed.JPEG",
  //         "lastActive": "2025-05-02T02:00:33.726Z",
  //         "fullName": "Sagor Ahamed"
  //     },
  //     "createdAt": "2025-05-02T06:21:52.359Z",
  //     "updatedAt": "2025-05-02T06:21:52.359Z",
  //     "__v": 0
  // }
  axiosInstance
    .patch(`/chat/channel/remove-user/${member.chat}`, {member})
    .then(res => {
      if (res.data?.success) {
        loadCrowdMember(member);
        fetchMembers({chatId: member.chat, limit: 5, page: 1});
        store.dispatch(setSelectedMembers({}));
        store.dispatch(updateSingleChatMemberCount('remove'));
        showToast({
          message: `${member.user.firstName} has been removed from crowd.`,
        });
        loadChats();
        // dispatch(
        //   updateMembersCount({
        //     _id: chat._id,
        //     membersCount: chat.membersCount - 1,
        //   })
        // );
      }
    })
    .catch(error => {
      showToast({message: error.response.data.error});
      console.log('🚀 ~ handleRemoveUser ~ error', error.response.data);
    });
};

export const onEmojiClick = (emoji, messageId, messageData) => {
  // Create a copy of the message data to avoid mutaticon
  // console.log('messageData', JSON.stringify(messageData, null, 2));
  const updatedMessage = {
    ...messageData,
    reactions: {...messageData.reactions},
  };

  const currentReaction = updatedMessage.myReaction;

  if (currentReaction === emoji) {
    // Remove the reaction
    const currentCount = updatedMessage.reactions[emoji];
    if (currentCount === 1) {
      delete updatedMessage.reactions[emoji];
    } else {
      updatedMessage.reactions[emoji] = currentCount - 1;
    }
    updatedMessage.myReaction = null;
    updatedMessage.reactionsCount -= 1;
  } else {
    // Remove existing reaction if present
    if (currentReaction !== null) {
      const oldEmoji = currentReaction;
      const oldCount = updatedMessage.reactions[oldEmoji];
      if (oldCount === 1) {
        delete updatedMessage.reactions[oldEmoji];
      } else {
        updatedMessage.reactions[oldEmoji] = oldCount - 1;
      }
      updatedMessage.reactionsCount -= 1;
    }
    // Add the new reaction
    const newCount = updatedMessage.reactions[emoji] || 0;
    updatedMessage.reactions[emoji] = newCount + 1;
    updatedMessage.myReaction = emoji;
    updatedMessage.reactionsCount += 1;
  }

  // Optimistically update the store with the modified message data
  store.dispatch(
    updateEmoji({
      ...updatedMessage,
      parentMessage: messageData.parentMessage || '',
    }),
  );

  axiosInstance
    .put(`/chat/react/${messageId}`, {symbol: emoji})
    .then(res => {
      if (res.data.success) {
        // Update with the actual server response to ensure consistency
        store.dispatch(
          updateEmoji({
            ...res.data.message,
            parentMessage: messageData.parentMessage,
          }),
        );
      }
    })
    .catch(err => {
      // Revert to the original message data on error
      store.dispatch(updateEmoji(messageData));
      console.log('error in chat reaction', err);
      showToast({message: err.response.data.error || 'Emoji cannot be sent'});
    });
};
export const handleDelete = id => {
  // setIsDeleting(true);

  axiosInstance
    .delete(`/chat/delete/message/${id}`)
    .then(res => {
      if (res.data.success) {
        if (!res.data.message.parentMessage) {
          store.dispatch(updateDeletedMessage(res.data.message));
        } else {
          store.dispatch(updateThreadMessage(res.data.message));
        }
        // if(store.getState().chat.singleChat.latestMessage._id !== res.data?.message._id)
        store.dispatch(
          updateLatestMessage({
            chatId: res.data.message.chat,
            latestMessage: {text: '', type: 'delete'},
            counter: 1,
          }),
        );
      }
      // handleUpdateMessage(res.data.message);
      // const isItPinned = pinnedMessages?.filter(
      //   (item) => item._id === message._id
      // );
      // if (isItPinned?.length) {
      //   axiosInstance
      //     .patch(`/chat/pin/${message?._id}`)
      //     .then((res) => {
      //       if (res.data.message) {
      //         handleUpdateMessage(res.data.message);
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // }
      // dispatch(
      //   updateLatestMessage({
      //     chatId: chat?._id,
      //     latestMessage: { text: "" },
      //     counter: 1,
      //   })
      // );
      // setMessageToDelete(null);
    })
    .catch(err => {
      console.log(err);
      // Alert.alert(err?.response?.data?.error || "Error");
    });
};
export const handleReadAllNotification = () => {
  const notifications = store.getState().notification.notifications;
  const notificationCount = store.getState().notification.notificationCount;
  store.dispatch(setNotificationCount({...notificationCount, totalUnread: 0}));
  const readNotifications = notifications.map(item => ({
    ...item,
    opened: true,
  }));
  store.dispatch(setNotifications(readNotifications));
  // store.dispatch(
  //   setNotifications(pre => pre.map(item => ({...item, opened: true}))),
  // );
  axiosInstance
    .patch('/notification/markreadall', {})
    .then(response => {
      // console.log("res.data", JSON.stringify(res.data, null, 1));
      axiosInstance
        .get('/notification/mynotifications')
        .then(res => {
          store.dispatch(setNotifications(res.data?.notifications));
          store.dispatch(
            setNotificationCount({
              totalCount: res.data.totalCount,
              totalUnread: res.data.totalUnread,
            }),
          );
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const LoadCalenderInfo = () => {
  axiosInstance
    .post('/dashboard/portal', {calendar: {}})
    .then(res => {
      if (res.data.success) {
        store.dispatch(setCalendar(res.data.data.calendar.results));
      }
    })
    .catch(error => {
      handleError(error);
    });
};
export const LoadMockInterviewInfo = () => {
  axiosInstance
    .post('/dashboard/portal', {mockInterview: {}})
    .then(res => {
      if (res.data.success) {
        console.log('res.data', JSON.stringify(res.data, null, 2));
        store.dispatch(setMockInterview(res.data.data.mockInterview.results));
      }
    })
    .catch(error => {
      handleError(error);
    });
};

export const LoadDayToDayActivities = (page, setIsLoading) => {
  setIsLoading(true);
  axiosInstance
    .get(`communication/myshout/day2day?page=${page}&limit=8`)
    .then(res => {
      if (res.data.success) {
        store.dispatch(initialActivities({data: res?.data?.posts, page}));
        store.dispatch(setActivitiesCount(res.data.count));
      }
      setIsLoading(false);
    })
    .catch(error => {
      handleError(error);
      setIsLoading(false);
    });
};
export const fetchOnlineUsers = async () => {
  try {
    const response = await axiosInstance.get('user/online');
    const {data} = response;
    if (!data || !data.users) {
      console.error('Error fetching online users: invalid response');
      return;
    }
    store.dispatch(setOnlineUsers(data.users));
  } catch (error) {
    console.error('Error fetching online users:', error);
  }
};

export const loadCalendarEvent = async queryParams => {
  try {
    const response = await axiosInstance.get('/v2/calendar/event/myevents', {
      params: queryParams,
    });
  } catch (error) {
    console.log('error.response', JSON.stringify(error.response, null, 2));
  }
};

export const getReplies = ({setIsLoading, parentMessage, chat, page}) => {
  setIsLoading(true);
  const options = {
    page,
    parentMessage,
    chat,
  };

  axiosInstance
    .post('/chat/messages', options)
    .then(res => {
      store.dispatch(setThreadMessages(res.data.messages));
      setIsLoading(false);
    })
    .catch(error => {
      console.log('Error getting replies:', error);
      setIsLoading(false);
      showToast({
        message: error.response?.data?.error || 'Failed to load data',
      });
    });
};

export const getMyNavigation = async () => {
  await axiosInstance
    .get('/navigation/mynavigations')
    .then(res => {
      saveToMMKV('navigationData', res.data.navigations);

      store.dispatch(setNavigation(res.data.navigations));
    })
    .catch(err => {
      console.log(err);
    });
};
export const getSingleMessage = messageId => {
  axiosInstance
    .get(`/chat/message/${messageId}`)
    .then(res => {
      // console.log(
      //   'getting single message',
      //   JSON.stringify(res.data.message, null, 2),
      // );
      store.dispatch(setSingleMessage(res.data.message));
    })
    .catch(err => {
      console.log(
        'error getting single message',
        JSON.stringify(err.response.data, null, 2),
      );
      showToast({message: err.response.data.error || 'Something is wrong '});
    });
};

export const uploadToCloud = async asset => {
  const formData = new FormData();
  formData.append('file', {
    uri: asset.uri,
    name: asset.fileName || 'uploaded_image',
    type: asset.type || 'image/jpeg',
  });

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const res = await axios.post(
    'https://api.skillbnk.com/api/document/useranydocument',
    formData,
    config,
  );
  return res.data.fileUrl;
};
