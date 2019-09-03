import React, { Component } from 'react';
import { Row, Col, message } from 'antd';
import apiUrls  from '@/utils/config'
import fetch from '@/utils/fetch'
import './Job.css';
//日志列表
import JobList from '@/Component/JobList/JobList'
//顶部操作
import Top from '@/Component/Top/Top'
//任务设置
import Settings from '@/Component/Settings/Settings'

class Job extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isStart: false,
            logs: [],
            countDown: 5,
            dataSource: [//table数据
                {
                    key: '0',
                    name: 'xxx',
                    time: { day: '0', hour: '7', minute: '0' },
                    count: '1'

                },
                {
                    key: '1',
                    name: 'xxx',
                    time: { day: '0', hour: '7', minute: '0' },
                    count: '1'
                }
            ],

            apiUrl: {
                origin: apiUrls.origin,
                port: apiUrls.port
            },
            channelId: ''
        }
        sessionStorage.setItem("logs", JSON.stringify(this.state.logs));
    }
    componentDidMount() {
      
    }

    componentWillUnmount() {
        //清除所有定时器
        clearInterval(this.countDown)
        clearInterval(this.commoJobID)
        clearInterval(this.cardJobID)
    }
    //修改table数据
    changeValue = (val, index, type, event) => {
        let data = this.state.dataSource
        if (type === 'blur') {
            if (val === 'count') {
                data[index][val] = data[index][val] ? data[index][val] : 1
            } else {
                data[index].time[val] = data[index].time[val] ? data[index].time[val] : 0
            }

            this.setState({
                dataSource: data
            })
            this.setJob()
        } else {
            if (val === 'count') {
                data[index][val] = event.target.value
            } else {
                data[index].time[val] = event.target.value
            }

            this.setState({
                dataSource: data
            })
        }
    }

    //简单封装一个axios的post方法
    fetchData = (val) => {
        let resObj = {
            title: (new Date()).toLocaleString() + " : " + val.name,
            description: ''
        }
        fetch.post(val.url, {}).then(res => {
            resObj.description = '调用成功'
            this.addToLogs(resObj)
        }).catch(errMsg => {
            resObj.description = errMsg
            this.addToLogs(resObj)
        })
    }

    addToLogs(val) {
        this.setState({
            logs: [val, ...this.state.logs]
        })
        sessionStorage.setItem("logs", JSON.stringify(this.state.logs));
    }

    cardInfoToHb = () => {
        this.fetchData({
            url: `http://${this.state.apiUrl.origin}:${this.state.apiUrl.port}/api/xxx/xxx?xxx=${this.state.channelId}`,
            name: 'xxxx'
        })
    }

    commoStockToHb = () => {
        this.fetchData({
            url: `http://${this.state.apiUrl.origin}:${this.state.apiUrl.port}/api/xxx/xxx?xxx=${this.state.channelId}`,
            name: 'xxxx'
        })
    }
    //开启定时器
    startJob = () => {
        if (!this.state.channelId) {
            message.warning("请先选择一个门店！")
            return
        }
        if (this.state.countDown !== 0) {
            this.setState({
                countDown: 0
            })
            clearInterval(this.countDown)
        }
        this.setState({
            isStart: true,
            loading: true
        })
        this.commoStockToHb()
        this.cardInfoToHb()
        this.setJob()
    }
    //设置定时器
    setJob = () => {
        clearInterval(this.commoJobID)
        clearInterval(this.cardJobID)

        //任务数据源
        let commoTimeSource = this.state.dataSource[0].time, cardTimeSource = this.state.dataSource[1].time
        //任务时间间隔
        let commoIntervalHour = Math.floor((24 - commoTimeSource.hour) / this.state.dataSource[0].count),
            cardIntervalHour = Math.floor((24 - commoTimeSource.hour) / this.state.dataSource[1].count);

        //间隔时间数组
        let commoTime = this.setHourInterval(commoTimeSource, this.state.dataSource[0].count, commoIntervalHour);
        let cardTime = this.setHourInterval(cardTimeSource, this.state.dataSource[1].count, cardIntervalHour);

        //测试输出任务时间
        console.log(commoTime)
        console.log(cardTime)

        this.commoJobID = setInterval(() => {
            let dates = new Date();
            let currentTime = dates.getHours() + ":" + dates.getMinutes() + ":" + dates.getSeconds()
            if (commoTime.includes(currentTime)) {
                this.commoStockToHb();
            }
        }, 1000)
        this.cardJobID = setInterval(() => {
            let dates = new Date();
            let currentTime = dates.getHours() + ":" + dates.getMinutes() + ":" + dates.getSeconds()
            if (cardTime.includes(currentTime)) {
                this.cardInfoToHb();
            }
        }, 1000)
    }
    //设置间隔小时数
    setHourInterval(timeSource, count, interval) {
        let arr = []
        for (let index = 0; index < count; index++) {
            arr.push((parseInt(timeSource.hour) + parseInt(index * interval)) + ":" + timeSource.minute + ":0")
        }
        return arr
    }
    //停止定时器
    stopJob = () => {
        this.setState({
            isStart: false,
            loading: false
        })
        clearInterval(this.commoJobID)
        clearInterval(this.cardJobID)
    }
    //取消定时器
    cancelJob = () => {
        clearInterval(this.countDown)
        let countDown = 0
        this.setState({ countDown })
    }
    //清除table数据
    clearLog = () => {
        this.setState({
            logs: []
        })
        sessionStorage.setItem("logs", JSON.stringify(this.state.logs));
    }

    //过滤table数据
    filterLog = (val) => {
        let logs = JSON.parse(sessionStorage.getItem("logs"))
        if (val) {
            logs = logs.filter(item => {
                return item.title.indexOf(val) !== -1
            })
        }
        this.setState({
            logs: logs
        })
    }
    //接口地址
    changeApiUrl = (val, type, event) => {
        let data = this.state.apiUrl
        if (type === 'blur') {
            data[val] = data[val] ? data[val] : apiUrls[val]
            this.setState({
                apiUrl: data
            })
            this.setJob()
        } else {
            data[val] = event.target.value
            this.setState({
                apiUrl: data
            })
        }
    }
    updateChannel = (channelId) => {
        this.setState({ channelId })
        this.stopJob()
    }

    render() {
        return (
            <div className="job">
                <Row type="flex" justify="center" align="center" style={{ margin: 20 }} gutter={16}>
                    <Col span={8}>
                        <Top
                            loading={this.state.loading}
                            isStart={this.state.isStart}
                            countNumber={this.state.countDown}
                            onStopJob={this.stopJob}
                            onStartJob={this.startJob}
                            onClearLog={this.clearLog}
                            onCancelJob={this.cancelJob}
                        ></Top>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="top">
                    <Col span={22}>
                        <Col span={10}>
                            <Settings
                                apiUrl={this.state.apiUrl}
                                isStart={this.state.isStart}
                                dataSource={this.state.dataSource}
                                onUpdateChannel={this.updateChannel}
                                onChangeApiUrl={this.changeApiUrl}
                                onChangeValue={this.changeValue}
                            ></Settings>
                        </Col>
                        <Col span={14}>
                            <JobList
                                dataSource={this.state.logs}
                                onFilter={this.filterLog}
                            ></JobList>
                        </Col>
                    </Col>

                </Row>
            </div>


        );
    }
}

export default Job;