import store from '../store';
import axiosInstance from '../utility/axiosInstance';
import {setNotificationCount} from '../store/reducer/notificationReducer';
import moment from 'moment';
import {
  setEventNotification,
  setEvents,
  setFilterState,
  setHolidays,
  setInvitations,
  setMonthViewData,
  setSingleEvent,
  setUsers,
  setWeekends,
  updateCalendar,
} from '../store/reducer/calendarReducer';
import {
  setCommentCount,
  setCommunityPosts,
  setIsLoading,
  setQueryPosts,
  setReactions,
  setSelectedPost,
  setTotalPost,
} from '../store/reducer/communityReducer';
import {
  addReplies,
  setComments,
  setSelectedComment,
  updateComment,
} from '../store/reducer/commentReducer';
import {setPrograms} from '../store/reducer/programReducer';
import {
  setArchivedChats,
  setChats,
  setGroupNameId,
} from '../store/reducer/chatReducer';
import {showToast} from '../components/HelperFunction';
import {getFromMMKV} from '../utility/mmkvHelpers';

const hasMenu = menuId => {
  const navigationData = getFromMMKV('navigationData');
  if (!Array.isArray(navigationData)) return false;

  return !!navigationData.find(menu => menu.id === menuId);
};
export const loadChats = async () => {
  const hasChat = hasMenu('portal-my-chats');
  if (!hasChat) return;
  try {
    const response = await axiosInstance.get('/chat/mychats');
    console.log(
      'Total chats',
      JSON.stringify(response.data.chats.length, null, 2),
    );
    if (response.data.chats.length > 0) {
      const {chats} = response.data;
      store.dispatch(setChats(chats.filter(item => !item.isArchived)));
      store.dispatch(
        setArchivedChats({
          action: 'add',
          chats: chats.filter(item => item.isArchived),
        }),
      );
      store.dispatch(setGroupNameId(chats));
      // console.log('chats.length', JSON.stringify(chats.length, null, 2));
      // const unreadChats = chats.filter(
      //   chat =>
      //     !chat.myData.isRead &&
      //     chat.myData.user !== chat.latestMessage.sender._id,
      // );
    } else {
      console.log('No chat found');
      store.dispatch(setChats([]));
    }
  } catch (error) {
    console.error('Error fetching my chats:', error);
  }
};

export const loadCalendarEvent = async () => {
  console.log('Calender Event Called');
  await axiosInstance
    .get('/calendar/event/myevents')
    .then(res => {
      store.dispatch(setEvents(res.data.events || []));
      store.dispatch(setFilterState(''));

      let temp = [...res.data.events];
      let array = temp.map(e => ({
        title: moment(e.start).format('YYYY-M-D'),
        data: {...e},
      }));

      var result = [
        ...array
          .reduce((c, {title, data}) => {
            if (!c.has(title)) {
              c.set(title, {title, data: []});
            }
            c.get(title).data.push(data);
            return c;
          }, new Map())
          .values(),
      ];

      const monthViewData = result.reduce((acc, item) => {
        acc[item.title] = item;
        return acc;
      }, {});
      store.dispatch(setMonthViewData(monthViewData));
      store.dispatch(updateCalendar(result));
    })
    .catch(err => {
      console.log(err);
    });
};
export const loadEventInvitation = () => {
  axiosInstance
    .get('/calendar/event/myevents')
    .then(res => {
      const invitation = res?.data?.events?.filter(
        item => item?.myParticipantData?.status === 'pending',
      );
      store.dispatch(setInvitations(invitation || []));
    })
    .catch(err => {
      console.log(err);
    });
};

export const loadHolidays = () => {
  axiosInstance
    .get('/calendar/config/type/holiday')
    .then(res => {
      store.dispatch(setHolidays(res.data.holidays));
    })
    .catch(err => {
      console.log(err);
    });
};
export const loadWeekends = () => {
  axiosInstance
    .get('/calendar/config/type/weekend')
    .then(res => {
      store.dispatch(setWeekends(res.data.holidays));
    })
    .catch(err => {
      console.log(err);
      console.log(
        'err.response.data',
        JSON.stringify(err.response.data, null, 2),
      );
    });
};
export const loadNotifications = async () => {
  await axiosInstance
    .get('/notification/mynotifications?limit=1&page=1')
    .then(res => {
      store.dispatch(
        setNotificationCount({
          totalCount: res.data.totalCount,
          totalUnread: res.data.totalUnread,
        }),
      );
    })
    .catch(err => {
      console.log(err);

      console.log('error to load notifications', JSON.stringify(err, null, 2));
    });
};
export const loadInitialNotifications = () => {
  axiosInstance
    .get('/notification/mynotifications?limit=1&page=1')
    .then(res => {
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
};
export const loadUsers = inputText => {
  axiosInstance
    .post('/user/filter', {
      query: inputText,
      global: true,
    })
    .then(res => {
      store.dispatch(setUsers(res.data.users));
    })
    .catch(err => {
      console.log('err', JSON.stringify(err, null, 1));
    });
};
export const getNotificationData = id => {
  axiosInstance
    .get(`/notification/job/getactive/${id}`)
    .then(res => {
      const notifications =
        res?.data?.notifications?.map(item => item?.notification) || [];
      store.dispatch(setEventNotification(notifications));
    })
    .catch(error => {
      console.log('Error fetching notification data:', error);
    });
};
export const getEventDetails = (eventId, setLoad = () => {}) => {
  // console.log(
  //   'function called.......................',
  //   JSON.stringify(eventId, null, 1),
  // );
  setLoad(true);
  axiosInstance
    .get(`/calendar/event/details/${eventId}`)
    .then(res => {
      if (res.data.success) {
        store.dispatch(setSingleEvent(res.data.event));
      }
      setLoad(false);
    })
    .catch(err => {
      console.log(
        'err you got from calendar/event/details',
        JSON.stringify(err, null, 1),
      );
      setLoad(false);
    });
};
export const loadCommunityPosts = () => {
  const comInfo = store.getState().community.comInfo;
  if (comInfo?.page > 1) {
    store.dispatch(setIsLoading(true));
  }

  axiosInstance
    .post('/content/community/post/getall', comInfo)
    .then(res => {
      console.log(
        'res.data.posts.length',
        JSON.stringify(res.data.posts.length, null, 2),
      );
      if (res?.data?.success) {
        if (comInfo?.page > 1) {
          store?.dispatch(setCommunityPosts(res.data.posts));
        } else if (comInfo?.page === 1) {
          store?.dispatch(setQueryPosts(res.data.posts));
        } else {
          store?.dispatch(setCommunityPosts(res.data.posts));
        }
        store.dispatch(setTotalPost(res.data.count));
      }
      // if (from === 'Initial load') {
      //   saveArrayToLocalStorage('communityPosts', res.data.posts);
      // }
      store.dispatch(setIsLoading(false));
    })
    .catch(error => {
      console.log(
        'To get all post',
        JSON.stringify(error.response.data, null, 2),
      );
      handleError(error);
      store?.dispatch(setCommunityPosts([]));
      store.dispatch(setTotalPost(0));
      // loading(false);
      store.dispatch(setIsLoading(false));
    });
};

export const giveReaction = (postId, symbol, popup) => {
  axiosInstance
    .put(`/content/community/post/react/${postId}`, symbol)
    .then(res => {
      if (res.data.success) {
        store.dispatch(setSelectedPost(null));
        store.dispatch(setReactions(res.data.post));

        // console.log("res.data", JSON.stringify(res.data, null, 1));
      }
    })
    .catch(error => {
      if (error.response) {
        console.log(
          'Response error:',
          JSON.stringify(error.response.data, null, 1),
        );
        console.log('Status code:', error.response.status);
      } else if (error.request) {
        console.log('Request error:', JSON.stringify(error.request, null, 1));
      } else {
        console.log('Error:', error.message);
      }
      console.log('Full error object:', JSON.stringify(error, null, 1));
    });
};

export const handleError = (error, from) => {
  // console.log('from', JSON.stringify(from, null, 2));
  if (error.response) {
    showToast({message: error.response.data.error});
    console.log('Status code:', error.response.status);
  } else if (error.request) {
    console.log('Request error:', JSON.stringify(error.request, null, 1));
  } else {
    console.log('Error:', error.message);
  }
  console.log('Full error object:', JSON.stringify(error, null, 1));
};

export const getComments = async postId => {
  try {
    const res = await axiosInstance.get(`/content/comment/get/${postId}`);
    // console.log('res.data.comments.length', JSON.stringify(res.data, null, 2));
    if (res.data.success) {
      const {comments} = res.data;
      const commentsWithRepliesPromises = comments.map(async comment => {
        if (comment.repliesCount > 0) {
          try {
            const repliesRes = await axiosInstance.get(
              `/content/comment/get/${comment.contentId}?parentId=${comment._id}`,
            );
            return {
              ...comment,
              commentId: comment._id,
              replies: repliesRes.data.comments || [],
            };
          } catch (error) {
            handleError(error);
            return {
              ...comment,
              commentId: comment._id,
              replies: [],
            };
          }
        } else {
          return {
            ...comment,
            commentId: comment._id,
            replies: [],
          };
        }
      });

      const commentsWithReplies = await Promise.all(
        commentsWithRepliesPromises,
      );
      store.dispatch(setComments(commentsWithReplies));
    } else {
      console.error('Failed to fetch comments:', res.data.message);
      store.dispatch(setComments([]));
    }
  } catch (err) {
    console.error('Error fetching comments:', err);
    handleError(err);
    store.dispatch(setComments([]));
  }
};
export const giveReply = data => {
  axiosInstance
    .post('/content/comment/create', data)
    .then(res => {
      if (res.data.success) {
        showToast({message: 'Reply added'});
        store.dispatch(setSelectedComment(null));
        store.dispatch(addReplies(res.data.comment));
        store.dispatch(
          updateComment({
            commentId: res.data.comment.parentId,
            data: {isReplyOpen: false},
          }),
        );

        getComments(data.contentId);
        store.dispatch(
          setCommentCount({contentId: data.contentId, action: 'add'}),
        );
      }
    })
    .catch(error => {
      handleError(error);
    });
};

export const loadProgramInfo = async () => {
  await axiosInstance
    .get('/enrollment/myprogram')
    .then(res => {
      if (res.data.success) {
        store.dispatch(setPrograms(res.data));
      }
    })
    .catch(error => {
      console.log(
        'error to load programs info',
        JSON.stringify(error.response.data.error, null, 1),
      );
    });
};
