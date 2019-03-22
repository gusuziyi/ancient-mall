# ancient-mall

从二月七日到三月二十一日，花费四十多天时间，基本完成了一个电商系统的设计。从开始的原型设计、前端页面搭建，到后来数据库设计、编写后端中间层，再到最后的前后端联调，打包部署，一路走来，成长进步了许多。

> 整个系统包括用户管理、商城、购物结算、地图定位、三维展示、智能客服、分类检索、订单管理、库存管理、物流查询等模块。


技术栈：
框架：nuxt，前端：vue+less+element，后端：koa，数据库：mongodb+redis，云端：阿里云OSS，三维模块：echarts-gl

点击查看 [功能介绍](https://www.jianshu.com/p/f205a865aa5c).

## 安装方法

``` 运行方式
# 安装依赖包
$ npm install

# 安装mongodb数据库和redis数据库
$ mongodb下载地址：https://www.mongodb.com/download-center/community
$ redis  下载地址：https://github.com/MicrosoftArchive/redis/releases

# 在mongodb中新建ancient-mall数据库
首先在数据库中建立Goodses，Shops，Inventory，Province，HotCity五个数据表，数据为db文件夹下同名json，
添加数据语法为 db.Goodses.insertMany([.......])
然后在数据库中建立Chat，RealManChat，Fav，Last，PayList，Users，UserCart七个空表

# 开发模式运行在 localhost:3000
$ npm run dev

# 生产模式
$ npm run build
$ npm start

# 静态部署 (项目内有大量的动态加载，请尽量避免使用静态部署)
$ npm run generate
```

