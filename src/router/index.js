export default [
    {
    	path:'*',
    	name:'home',
    	component (resolve) {require(['@/views/index'], resolve)}
    },{
      path:'/index',
      name:'homeIndex',
      component (resolve) {require(['@/views/index'], resolve)}
    }
  ]