const commonFn = {
  j2s (obj) {
    return JSON.stringify(obj)
  },
  toastMsg (type, msg) {
    switch (type) {
      case 'normal':
        bus.$vux.toast.show({
         text: msg,
         type: 'text'
        })
        break
      case 'success':
        bus.$vux.toast.show({
         text: msg,
         type: 'success'
        })
        break
      case 'warning':
        bus.$vux.toast.show({
         text: msg,
         type: 'warn'
        })
        break
      case 'error':
        bus.$vux.toast.show({
         text: msg,
         type: 'text',
          time: 1500
        })
        break
    }
  }
}
export default commonFn

