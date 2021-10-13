export const API_URL_MAP = {
  crawlerSendMessageUrl: `/app/crawler/start/`,
  crawlerComunicationUrl: `/app/crawler/p2p_message`,
  crawlerRepliesUrl: `/user/topic/replies`,
  crawlerAccountSelectEikaUrl: `/app/crawler/reply/eika/choose-account-to-process`,
  tinkSendMessageUrl: `/app/tink/start`,
  auth: {
    base: '/auth',
    token: '/token',
    signin: '/signin',
    logout: '/logout',
    signup: '/signup',
    me: '/me',
    user: '/user',
    demo: '/login/demo',
    bankidLogin: '/bank-id/login'
  },
  user: {
    base: '/user',
    me: '/me',
    preferences: '/preferences',
    firstLoan: '/first-loan',
    interestedFixedRate: '/interestedFixedRate',
    qualify4Blu: '/qualify4Blu',
    savings: '/savings',
    phone: '/phone',
    propertyValue: '/propertyValue',
    otherDebt: '/otherDept',
    income: '/income',
    birthdate: '/birthdate',
    membership: '/membership',
    communication: {
      base: '/communication',
      contactUs: '/contact-us',
      missingBanks: '/missing-banks'
    }
  },
  loan: {
    base: '/loan',
    confirmation: '/confirmation',
    stat: {
      base: '/stat',
      click: '/click'
    },
    public: {
      base: '/public',
      email: {
        base: '/email',
        preferences: '/preferences/'
      }
    },
    loans: {
      base: '/loans',
      state: '/state',
      info: '/info'
    },

    loan: {
      base: '/loan',
      state: '/state',
      info: '/info'
    },
    user: {
      base: '/user',
      info: '/info'
    },
    preferances: {
      base: '/preferences',
      score: '/score'
    },
    membership: {
      base: '/membership',
      all: '/all',
      membershipTypes: '/membership-types'
    },
    bankOfferRequest: {
      base: '/bank-offer-request',
      preview: '/preview',
      send: '/send'
    },
    bankInfo: '/bank-info',
    offers: {
      base: '/offers',
      bank: '/bank'
    },
    newOffers: '/new-offers',
    loanSubType: '/loanSubType',
    loanType: '/loanType',
    localOffers: '/localOffers',
    remainingYears: '/remainingYears',
    outstandingDebt: '/outstandingDebt',
    preferences: '/preferences',
    membershipTypes: '/membership-types',
    address: '/address',
    size: '/size',
    property: '/property',
    value: '/current-value',
    estimatedValue: '/estimated-value',
    info: '/info',
    statistics: '/statistics'
  },
  profile: '/profil',
  preferances: '/preferanser',
  house: '/bolig'
};
