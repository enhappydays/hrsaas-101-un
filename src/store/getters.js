const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  routes: state => state.permission.routes,
  roles: state => state.user.userInfo.roles
}
export default getters
