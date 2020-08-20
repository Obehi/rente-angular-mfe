export const environment = {
    production: true,
    baseUrl: 'https://rente-gateway-dev.herokuapp.com',
    crawlerUrl: 'https://rente-ws-dev.herokuapp.com/ws',
    TINK_LINK: 'https://link.tink.com/1.0/authorize/?client_id=f58c3faf6749466384b71791fe233a22&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=accounts:read,investments:read,transactions:read,user:read,statistics:read,identity:read,credentials:read&market=SE&locale=en_US&test=true'
  };
  
  export { LoginSVComponent as LoginLangGenericComponent } from '../app/features/landing/locale/login/login-sv/login-sv.component';