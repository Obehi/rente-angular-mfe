import { environment } from '@environments/environment';


export const API_URL_MAP = {
  crawlerSendMessageUrl: `/app/crawler/start/`,
  crawlerComunicationUrl: `/app/crawler/p2p_message`,
  crawlerRepliesUrl: `/user/topic/replies`,
  auth: {
    base: '/auth',
    token: '/token',
    signin: '/signin',
    logout: '/logout',
    signup: '/signup',
    me: '/me',
    user: '/user'
  },
  user: {
    base: '/user',
    me: '/me',
    preferences: '/preferences'
  },
  loan: {
    base: '/loan',
    loans: {
      base: '/loans',
      state: '/state'
    },
    offers: '/offers',
    membership: '/membership',
    membershipTypes: '/membership-types',
    address: '/address',
    size: '/size',
    property: '/property',
    value: '/current-value',
    estimatedValue: '/estimated-value'
  },
  profile: '/profil',
  preferances: '/preferanser',
  house: '/bolig'
};
