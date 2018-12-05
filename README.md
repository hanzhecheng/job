# 定时任务
> 基于最新版本的react,脚手架create-react-app ,UI:ant design,第一次写react,跟vue相比少了很多语法糖,很多东西都要自己实现。对es6熟悉的话,看看官网上手也快.
react官网跟vue不是一个档次的,中文文档相对少很多,看一天写个简单页面玩下,习惯vue+vue-router+vuex,今后多学习下对应的react版本。

## 构建程序

``` bash
yarn

yarn start

yarn build

```
### 2018/11/30 更新
- 将原页面的内容改成独立组件

### 2018/12/4 更新
- 封装axios，统一处理错误信息

### 2018/12/5 更新
 - 增加页面Loading骨架图，采用react-content-loader，需要自己设置一下简单的svg图即可
 - 增加react-loadable，异步加载组件，配合loading，非常的方便
