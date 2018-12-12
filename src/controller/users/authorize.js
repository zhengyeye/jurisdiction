const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }

  async listAction(){
    console.log('****************list');
    console.log(this.get());//{ rows: '1', page: '1', _: '1544513386741' }
    let getData=this.get();
    let whereObj={state:['!=',-2]};
    if (getData.name) {
      whereObj['name'] = ['like', '%' + getData.name + '%'];  
    }
    let result = await this.model('users').where(whereObj).page(getData.page,getData.rows).order('id DESC').countSelect();
    // console.log(result);
    return this.json({total: result.count, rows: result.data});
  }

  /**
   *树形结构数据
   *
   * @returns
   */
  async initmeuntreeAction(){
    console.log('****************initmeuntree');
    // let uid=userInfo.id || 1;
    let uid= 1;
    let sql="SELECT `am`.`menuid` AS `id`,`am`.`menuname` AS `name`,`am`.`pmenuid` AS `pId`,'true' AS `open`,'1' AS `type` FROM `menu` `am` WHERE `am`.`menuid` IN (SELECT ap.menuid FROM permissions ap WHERE ap.userid = "+uid+" GROUP BY ap.menuid) UNION SELECT `ao`.`operateid` AS `id`,`ao`.`operatename` AS `name`,`ao`.`menuid` AS `pId`,'true' AS `open`,'2' AS `type`FROM`operations` `ao`,permissionssplit ap WHERE ap.userid = "+uid+" and ao.menuid=ap.menuid and ao.operateid=ap.operateid";
    let meuns=await this.model('').query(sql);
    return this.json({rows:meuns});
  }
  /*根据用户ID查询用户权限
  * method querylist
  *@param id  用户ID
  **/
  async querylistAction(){
    console.log('****************querylist');
    let postData=this.post();
    let result=await this.model('permissions').where({userid:postData.id}).select();
    return this.json(result);
  }

  async updateAction(){
    let postData=this.post();
    let userid=postData.id;//用户ID
    let params=JSON.parse(postData.params);//菜单对象集合
    console.log(postData);
    await this.model('permissions').where({userid: userid}).delete();
    await this.model('permissionssplit').where({userid: userid}).delete();
    for (var mid in params) {
        for(let item of params[mid]){
            await this.model('permissionssplit').add({userid:userid ,menuid: mid,operateid:item});
        }
        await this.model('permissions').add({userid:userid ,menuid: mid,permission:params[mid].toString()});
    }
    return this.success('用户授权成功！')
  }
};
