import VueRouter from 'vue-router'

const originPush = VueRouter.prototype.push
const originReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function (path, sucessCb, failCb) {
  if (sucessCb || failCb) {
    originPush.call(this, path, sucessCb, failCb)
  } else {
    originPush.call(
      this,
      path,
      () => {},
      () => {}
    )
  }
}

VueRouter.prototype.replace = function (path, sucessCb, failCb) {
  if (sucessCb || failCb) {
    originReplace.call(this, path, sucessCb, failCb)
  } else {
    originReplace.call(
      this,
      path,
      () => {},
      () => {}
    )
  }
}
