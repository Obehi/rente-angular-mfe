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
    base: '/user'
  },
  loan: {
    base: '/loan',
    loans: '/loans',
    offers: '/offers'
  },
  profile: '/profil',
  preferances: '/preferanser',
  house: '/bolig'
};
