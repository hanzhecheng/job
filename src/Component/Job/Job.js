import React, { Component } from 'react';
import { Row, Col } from 'antd';
import apiUrls from '@/utils/config'
import axios from 'axios';
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
                    name: '推送会员卡信息',
                    time: { day: '0', hour: '0', minute: '5' }
                },
                {
                    key: '1',
                    name: '推送自营商品库存和价格',
                    time: { day: '0', hour: '0', minute: '5' }
                }
            ],
            apiUrl: {
                origin: apiUrls.origin,
                port: apiUrls.port
            }
        }
        sessionStorage.setItem("logs", JSON.stringify(this.state.logs));
    }
    componentDidMount() {
        this.countDown = setInterval(() => {
            this.setState({
                countDown: this.state.countDown - 1
            })
            if (this.state.countDown === 0) {
                clearInterval(this.countDown)
                this.startJob()
            }
        }, 1000)
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
            data[index].time[val] = data[index].time[val] ? data[index].time[val] : 0
            this.setState({
                dataSource: data
            })
            this.setJob()
        } else {
            data[index].time[val] = event.target.value
            this.setState({
                dataSource: data
            })
        }
    }
    //简单封装一个axios的post方法
    fetchData = (val) => {
        axios({
            url: val.url,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            onUploadProgress: function (progressEvent) { //原生获取上传进度的事件
                if (progressEvent.lengthComputable) {
                    //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                    //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                    console.log(progressEvent);
                }
            },
            data: {}
        }).then(res => {
            let resObj = {
                title: (new Date()).toLocaleString() + " : " + val.name,
                description: ''
            }
            if (res.data.status === 1) {
                resObj.description = '调用成功'
            } else {
                resObj.description = res.data.message
            }
            this.setState({
                logs: [resObj, ...this.state.logs]
            })
            sessionStorage.setItem("logs", JSON.stringify(this.state.logs));
        })
    }
    
    cardInfoToHb = () => {
        this.fetchData({
            url: `http://${this.state.apiUrl.origin}:${this.state.apiUrl.port}/api/OfflineApi/cardInfoToHb`,
            name: '推送会员卡信息'
        })
    }

    commoStockToHb = () => {
        this.fetchData({
            url: `http://${this.state.apiUrl.origin}:${this.state.apiUrl.port}/api/OfflineApi/commoStockToHb`,
            name: '推送自营商品库存和价格'
        })
    }
    //开启定时器
    startJob = () => {
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
        //一分钟
        let basicSecond = 1000 * 60
        let commoTimeSource = this.state.dataSource[0].time, cardTimeSource = this.state.dataSource[1].time
        this.commoJobID = setInterval(() => {
            this.commoStockToHb();
        }, (commoTimeSource.day * 24 * 60 + commoTimeSource.hour * 60 + commoTimeSource.minute) * basicSecond)
        this.cardJobID = setInterval(() => {
            this.cardInfoToHb();
        }, (cardTimeSource.day * 24 * 60 + cardTimeSource.hour * 60 + cardTimeSource.minute) * basicSecond)
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
                        ></Top>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="top">
                    <Col span={20}>
                        <Col span={10}>
                            <Settings
                                apiUrl={this.state.apiUrl}
                                dataSource={this.state.dataSource}
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