# Introduction
该项目为AEMenu项目提供后端支持，更多信息请参照前端项目：\
https://github.com/Emma-1024/aemenu

## 技术结构
- Express后端框架
- 文档型数据库MongoDB
- Jest单元测试
- 整合Babel，可使用超前的JavaScript语法

# License
MIT授权的开源项目

# Installation
```
git clone https://github.com/Alex-T-1024/aemenu-backend.git
npm install
```
# Run
### 前提：
1. 首次启动需创建 /src/credentials.js，内容如下：
```javascript
var credentials = {
  cookieSecret: '[Your cookie secret here]'
}

export default credentials

```
2. 安装MongoDB，根据数据库配置更改 /src/connectDb.js 中的DB链接信息
3. 启动DB服务器
### 启动：
```
npm run stable
```

# 其他
- 我们目前正在找工作，如果您感兴趣，请联系以下邮箱地址：
- 前端工程师：yongjie.wu@outlook.com
- 全栈工程师：yepeng.tian@outlook.com
