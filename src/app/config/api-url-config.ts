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
    preferences: '/preferences',
    communication: {
      base: '/communication',
      contactUs: '/contact-us',
      missingBanks: '/missing-banks'
    }
  },
  loan: {
    base: '/loan',
    confirmation: '/confirmation',
    loans: {
      base: '/loans',
      state: '/state'
    },
    bankOfferRequest: {
      base: '/bank-offer-request',
      preview: '/preview',
      send: '/send'
    },
    offers: '/offers',
    preferences: '/preferences',
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