const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }
  async loginAction(){
    console.log('**************');
    console.log(this.post());//{ username: 'admin', password: '123456' }
    //TODO:用户登录逻辑暂时不做，直接跳转正确的页面
    return this.redirect('/main');//跳转main路由（主要是修改页面显示url）
  }
};
