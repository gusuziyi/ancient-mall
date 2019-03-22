从二月七日到三月二十一日，花费四十多天时间，基本完成了一个电商系统的设计。从原型设计、前端页面搭建，到数据库设计、编写后端中间件，再到前后端联调，部署打包，一路走来进步了许多。

整个系统包括用户管理、商城、购物结算、地图定位、三维展示、智能客服、分类检索、订单管理、库存管理、物流查询等模块。下面我分别介绍一下

>技术栈：
框架：nuxt，前端：vue+less+element，后端：koa，数据库：mongodb+redis，云端：阿里云OSS，三维模块：echarts-gl

#####商城具备基本功能
**-用户管理模块**


 * 注册功能  [详细]()![填写用户名时会自动验证是否存在重名](https://upload-images.jianshu.io/upload_images/2770403-f9c369052c21721d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)
  


  * 验证密码 ![ 注册时会自动校验两次密码的一致性](https://upload-images.jianshu.io/upload_images/2770403-0868729777cab3d0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 邮件发送![系统会向指定邮箱发送一封包含验证码的邮件](https://upload-images.jianshu.io/upload_images/2770403-c7c02808edc5e8ed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 验证码判别![打开邮箱，复制验证码完成注册，注意验证码有效期只有10分钟](https://upload-images.jianshu.io/upload_images/2770403-4c8128637f015930.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  
  * 完善信息![注册成功后来到完善信息页面](https://upload-images.jianshu.io/upload_images/2770403-8b621475eccffad5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  * 上传头像![拖拽图片到上传框，即可设置个性头像](https://upload-images.jianshu.io/upload_images/2770403-ded4898758332fd1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 * 权限分组![在用户名前添加 gly 或 管理员 前缀，将注册为管理员，额外拥有卖家发货权限](https://upload-images.jianshu.io/upload_images/2770403-3c611b1b452a8633.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 * 登录功能![登录界面，如勾选 [记住我] 选项，以后每次登录，系统将自动为您填写账号密码](https://upload-images.jianshu.io/upload_images/2770403-7124f2754584b72f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
  * 社交账号绑定![登陆之后能查看个人信息，可随时点击 [更改资料] 按钮，解绑或绑定社交账号](https://upload-images.jianshu.io/upload_images/2770403-48dc481593c4e2ae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  * 签到打卡![每天签到能获得经验和积分，但当日内的多次签到将被系统拒绝](https://upload-images.jianshu.io/upload_images/2770403-37afa1c694ad753e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 等级积分 ![签到前，用户的等级、金币、经验](https://upload-images.jianshu.io/upload_images/2770403-48dc481593c4e2ae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)![签到之后用户等级、金币、经验都做出了更新](https://upload-images.jianshu.io/upload_images/2770403-08a8885b7d1b58db.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



**-商城功能**
  * 分类推荐![商城会根据浏览分类推荐商品，点击可看商品详情](https://upload-images.jianshu.io/upload_images/2770403-fbbd20e2bcd75018.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 影视资讯![影视去会抓取豆瓣电影最新的数据，点击可看电影详情](https://upload-images.jianshu.io/upload_images/2770403-4f8c14e3a5cda8c0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 商品详情![商品详情](https://upload-images.jianshu.io/upload_images/2770403-2b2ce83f6548d06a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 放大镜![鼠标移动到图片上会显示放大](https://upload-images.jianshu.io/upload_images/2770403-ee61639e0725cb20.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 多图预览![点击大图下方的图片可进行大图浏览](https://upload-images.jianshu.io/upload_images/2770403-70120fe323b39e35.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 折扣系统
参加折扣促销的商品，进入页面后会自动开始倒计时
  * 智能仓库![点选商品规格后，系统会自动匹配出最近有货的仓库，和库存数量](https://upload-images.jianshu.io/upload_images/2770403-027b750ca175dc3c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

   * 收藏夹
对于喜欢的商品可以点击收藏按钮，之后在个人收藏夹中进行管理

**-定位功能**
  * 自动定位
加载页面之后，用户城市位置会在顶部自动加载出现

  * 城市检索![用户也可自行更改显示城市](https://upload-images.jianshu.io/upload_images/2770403-886de527d49f2360.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 省市联动![选取省份后，市区选项被激活，可以点选该省下辖的地级市](https://upload-images.jianshu.io/upload_images/2770403-b6366918714d8835.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 搜索功能![搜索框内输入中文或字母缩写可以检索出对应城市](https://upload-images.jianshu.io/upload_images/2770403-ad086dc5937b2551.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**-球面展示**
  * 三维地球![点击 [查找门店] 按钮系统会把显示在球体上，球体可旋转缩放](https://upload-images.jianshu.io/upload_images/2770403-110b7735064f2c8c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 定位功能![点击坐标，会显示店铺相关信息，可点击链接直达店铺页面](https://upload-images.jianshu.io/upload_images/2770403-bc81e5941b747f19.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**-查看店铺**
* 店铺信息![首页会自动显示店铺位置、仓库位置以及热卖商品](https://upload-images.jianshu.io/upload_images/2770403-1a49e225866db395.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)![在数据库中，以店铺为中心，将商品与库存做了映射](https://upload-images.jianshu.io/upload_images/2770403-744565bb729ff366.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




 **-购物功能**
  * 最近添加![鼠标悬浮于购物袋按钮，会显示最近添加入购物车的两件商品](https://upload-images.jianshu.io/upload_images/2770403-4bbd870bab9c0526.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 购物车界面![同一商品的不同型号会被当做不同商品，若实时库存低于15会显示紧张](https://upload-images.jianshu.io/upload_images/2770403-4102220a1d34b611.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

   * 结账系统![选取需要结算的商品，点击结算按钮](https://upload-images.jianshu.io/upload_images/2770403-1b9d421bfaddfdeb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 -订单功能
  * 订单管理![结算后默认为未付款状态，需要手动点击付款](https://upload-images.jianshu.io/upload_images/2770403-1081c9b659b1d972.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


  * 提醒发货![付款后，买家可选择提醒卖家发货](https://upload-images.jianshu.io/upload_images/2770403-016390d77e2cbc1b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 卖家登录![使用管理员权限登录卖家系统，可以发货，管理员注册时须要有gly或管理员前缀](https://upload-images.jianshu.io/upload_images/2770403-a85ff871b139a6d6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 * 卖家发货![发货成功后，买家的订单将会得到更新](https://upload-images.jianshu.io/upload_images/2770403-60743d72aaac165e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


  * 实时物流![买家可在物流信息中得到距离，预计时长等信息](https://upload-images.jianshu.io/upload_images/2770403-dc9bfdad872d6262.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 -智慧客服
  * 智能陪聊![点击 [智慧客服] 按钮，客服小茉会与您进行智能陪聊](https://upload-images.jianshu.io/upload_images/2770403-0bdcfce12270946f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/400)

  * 斗图![聊不下去了？那就来一发斗图吧](https://upload-images.jianshu.io/upload_images/2770403-5d67a2fa891db799.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/400)

  * 快捷输入![点击发送按钮时，若输入框无信息，会出现默认快捷短语](https://upload-images.jianshu.io/upload_images/2770403-9af2f2edc595efb2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/400)

  * 转接人工![转接人工](https://upload-images.jianshu.io/upload_images/2770403-c0845979fb6edfc0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/400)

  * 聊天记录
点击右上角的 x 号，将保存聊天记录，没聊尽兴的话，可以来日再聊
  * 清空记录
点击清空按钮，将清空聊天记录，慎点

  -榜单热卖

  * 搜索功能![输入内容为空时会显示热门搜索和历史搜索](https://upload-images.jianshu.io/upload_images/2770403-51ee3c2c656a2e9f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 自动完成![输入内容不为空时会显示自动完成词汇](https://upload-images.jianshu.io/upload_images/2770403-2ff25ea916ba5ba3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 历史搜索
历史搜索将在输入时以下拉框形式呈现
  * 热词搜索
热词搜索将在输入时以下拉框形式呈现
  * 排序
点击开关可以进行排序
  
    
  
  
   