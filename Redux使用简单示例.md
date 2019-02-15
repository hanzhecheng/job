# Redux在react中的使用方法
> 作为一个用习惯了vuex的Vuer，第一次用redux真的想哭了，繁琐的操作，变态的写法，好在经过一天认真的阅读了下官网的说明，算是简单搞清楚了使用方法，简单的跟vuex对比一下，做个记录，以下文字相对白话，只是为了方便理解
## 简单定义一个todolist
### 1. 定义reducer  
redux中的reducer类比vuex的mutations，都是更改state，不同点在于`redux需要将新的state返回，vuex不需要`，多个reducer可以分多个js文件，然后在index.js中通过combineReducers将reducer合并，类似vuex的Modules，实例代码
```
 const todos = (state = [], action) => {
     switch (action.type) {
         case 'ADD_TODO':
             return [
                 ...state,
                 {
                     id: action.id,
                     text: action.text
                 }
             ]

         default:
             return state;
     }
 }
 export default todos
```

```
import { combineReducers } from 'redux'
import todos from './todos'
export default combineReducers({
    todos
})
```
### 2. 定义action  
redux的action，是定义需要调用那个reducer，主要是根据type字段，对应reducer的action.type，同时也可以传递一些参数，实例代码
```
let nextTodoId = 0;
export const addTodo = (text, id = nextTodoId++) => ({
    type: 'ADD_TODO',
    id: id,
    text
})
```
action不是必须要单独定义的，也可以在页面调用时直接写，例如
```
const actions = {
  increase: () => ({type: 'INCREASE'}),
  decrease: () => ({type: 'DECREASE'})
}
 
const store = createStore(reducer);
 
store.dispatch(actions.increase())

```
不过为了方便以后统一处理，最好还是单独定义一下
### 3. 定义containers  
定义完了上面的reducer和action，最关键的是要在页面中调用，因此需要定义一些显示的组件，官网上是定义的components，然后在containers中调用，这里为了方便展示我就直接放containers中了，实例代码:
```
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'
import './index.css'
const mapStateToProps = state => ({
    todos: state.todos
})
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addToList: (value) => dispatch(addTodo(value)),
    }
}

class AddTodo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
    }
    onChangeValue = (e) => {
        this.setState({
            value: e.target.value
        })
    }
    render() {
        const { todos, addToList } = this.props;
        return (
            <div>
                <input type="text" value={this.state.value} onChange={this.onChangeValue}></input>
                <div className="todos">
                    {todos.map((item, index) => {
                        return (
                            <div key={index}>{item.id + ':' + item.text}</div>
                        )
                    })}
                </div>
                <button type="button" onClick={addToList.bind(this, this.state.value)}>增加</button>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTodo)
```

从上往下挑一些重点说明一下
- `import { connect } from 'react-redux'`最重要的引用，create-react-app默认是不带react-redux的，需要手动安装一下npm i -S react-redux redux，`一定不要忘了还要装redux`，官网就简单的说安装react-redux，只装一个会报错
- mapStateToProps，简单理解就是将reducer中的state转换成页面可以用的props，同时也可以对state进行一些处理，类似vuex的getter
- mapDispatchToProps，就是调用reducer的方法，接收两个参数，dispatch 和 ownProps，`(value) => dispatch(addTodo(value))`就是调用action中定义的type对应的方法，value是对应的参数
- render中const { todos, addToList } = this.props，解构props，todos是mapStateToProps定义的对象，addToList是mapDispatchToProps定义的对象方法，使用方式和正常的props相同
-最后导出组件`connect(mapStateToProps, mapDispatchToProps)(AddTodo)`，写法比较固定，mapStateToProps如果没有不能不写，可以写成`connect(null, mapDispatchToProps)(AddTodo)`
### 4. app.js中展示
```
import React, { Component } from 'react';
import AddTodo from './containers/AddTodo'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AddTodo></AddTodo>
      </div>
    );
  }
}

export default App;
```
> **最后：** 以上只是redux的最简单使用示例，方便从vue转过来的朋友参考学习，如果有不对的地方，希望能评论中指出