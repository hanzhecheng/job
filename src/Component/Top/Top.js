import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import './Top.css';
class Top extends Component {
    render() {
        //倒计时
        const time = this.props.countNumber !== 0 ?
            <label className="job__countdowm">
                <span className="job__countdowm__num">{this.props.countNumber}</span>
                秒后将自动开始任务
                <span className="job__countdowm__cancel" onClick={this.props.onCancelJob}>取消</span>
            </label> : ""
        //操作按钮
        const buttons = this.props.isStart ? <Button type="danger" icon="stop" size="large" onClick={this.props.onStopJob}>终止任务</Button>
            : <Button type="primary" icon="play-circle" size="large" onClick={this.props.onStartJob}>立即执行</Button>

        return (
            <div className="job__top">
                {time}
                {buttons}
                <Button className="job__btn" icon="delete" size="large" onClick={this.props.onClearLog}>清空列表</Button>
                <Spin className="job__loading" tip="正在运行..." spinning={this.props.loading} />
            </div>

        )
    }
}

export default Top