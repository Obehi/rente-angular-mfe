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
    demo: '/login/demo'
  },
  user: {
    base: '/user',
    me: '/me',
    preferences: '/preferences',
    firstLoan: '/first-loan',
    interestedFixedRate: '/interestedFixedRate',
    qualify4Blu: '/qualify4Blu',
    savings: '/savings',
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
      state: '/state'
    },
    bankOfferRequest: {
      base: '/bank-offer-request',
      preview: '/preview',
      send: '/send'
    },
    bankInfo: '/bank-info',
    offers: '/offers',
    newOffers: '/new-offers',
    loanSubType: '/loanSubType',
    loanType: '/loanType',
    remainingYears: '/remainingYears',
    outstandingDebt: '/outstandingDebt',
    preferences: '/preferences',
    membership: '/membership',
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
