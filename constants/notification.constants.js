const NOTIFICATION_ACTIONS = {
  REACT_TO_POST: 'react_to_post',
  ACCEPT_FRIEND_REQUEST: 'accept_friend_request',
  SEND_FRIEND_REQUEST: 'send_friend_request',
  //   TAG_IN_POST: "tag_in_post",
  COMMENT_ON_POST: 'comment_on_post',
  //   REPLY_ON_COMMENT: "reply_on_comment",
};

module.exports = { NOTIFICATION_ACTIONS };

// export const NOTIFICATION_CONTEXT: Record<NOTIFICATION_ACTIONS, (...args: any[]) => string> = {
//     [NOTIFICATION_ACTIONS.REACT_TO_POST]: (actor?: string) => {
//       return `${actor || 'Someone'} reacted to your post`;
//     },
//     [NOTIFICATION_ACTIONS.ACCEPT_FRIEND_REQUEST]: (actor?: string) => {
//       return `${actor || 'Someone'} accepted your friend request`;
//     },
//     [NOTIFICATION_ACTIONS.SEND_FRIEND_REQUEST]: (actor?: string) => {
//       return `${actor || 'Someone'} sent you a friend request`;
//     },
//     [NOTIFICATION_ACTIONS.TAG_IN_POST]: (actor?: string) => {
//       return `${actor || 'Someone'} tagged you in a post`;
//     },
//     [NOTIFICATION_ACTIONS.COMMENT_ON_POST]: (actor?: string) => {
//       return `${actor || 'Someone'} commented on your post`;
//     },
//     [NOTIFICATION_ACTIONS.REPLY_ON_COMMENT]: (actor?: string) => {
//       return `${actor || 'Someone'} replied on your comment`;
//     },
//   };
