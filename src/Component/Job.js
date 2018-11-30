import React, { Component } from 'react';
import { Row, Col, List, Button, Spin, Input, Card, Table, Avatar } from 'antd';
import apiUrls from '../utils/config'
import axios from 'axios';
import './Job.css';
class Job extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isStart: false,
            logs: [],
            countDown: 5,
            tblColumns: [//table列
                {
                    title: '任务名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: "200"
                },
                {
                    title: '任务时间间隔',
                    dataIndex: 'time',
                    key: 'time',
                    render: (text, record) => (
                        <div className="job__table__column">
                            <Input value={text.day} onChange={this.changeValue.bind(this, 'day', record.key, 'change')} onBlur={this.changeValue.bind(this, 'day', record.key, 'blur')} /><span>天</span>
                            <Input value={text.hour} onChange={this.changeValue.bind(this, 'hour', record.key, 'change')} onBlur={this.changeValue.bind(this, 'hour', record.key, 'blur')} /><span>时</span>
                            <Input value={text.minute} onChange={this.changeValue.bind(this, 'minute', record.key, 'change')} onBlur={this.changeValue.bind(this, 'minute', record.key, 'blur')} /><span>分</span>
                        </div>
                    )
                }
            ],
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

    stopJob = () => {
        this.setState({
            isStart: false,
            loading: false
        })
        clearInterval(this.commoJobID)
        clearInterval(this.cardJobID)
    }

    clearLog = () => {
        this.setState({
            logs: []
        })
    }

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
        //操作按钮
        const buttons = this.state.isStart ? <Button type="danger" icon="stop" size="large" onClick={this.stopJob}>终止任务</Button>
            : <Button type="primary" icon="play-circle" size="large" onClick={this.startJob}>立即执行</Button>
        //倒计时操作
        const countDown = this.state.countDown !== 0 ?
            <label className="job__countdowm">
                <span className="job__countdowm__num">{this.state.countDown}</span>秒后将自动开始任务
            </label> : ""
        //成功icon
        const successIcon = <Avatar icon="check-circle" style={{ backgroundColor: '#fff', color: '#52c41a' }}></Avatar>
        //失败icon
        const errorIcon = <Avatar icon="close-circle" style={{ backgroundColor: '#fff', color: 'rgba(181, 44, 44, 1)' }}></Avatar>

        return (
            <div className="job">
                <Row type="flex" justify="center" align="center" style={{ margin: 20 }} gutter={16}>
                    <Col span={8}>
                        {countDown}
                        {buttons}
                        <Button className="job__btn" icon="delete" size="large" onClick={this.clearLog}>清空列表</Button>
                        <Spin className="job__loading" tip="正在运行..." spinning={this.state.loading} />
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="top">
                    <Col span={20}>
                        <Col span={10}>
                            <Card title="任务设置" bordered className="job__settings"
                                extra={<div className="job_apiurl">
                                    <span>接口地址:</span>
                                    <Input value={this.state.apiUrl.origin} onChange={this.changeApiUrl.bind(this, 'origin', 'change')} onBlur={this.changeApiUrl.bind(this, 'origin', 'blur')} />
                                    <span>端口:</span>
                                    <Input value={this.state.apiUrl.port} onChange={this.changeApiUrl.bind(this, 'port', 'change')} onBlur={this.changeApiUrl.bind(this, 'port', 'blur')} />
                                </div>}>
                                <Table dataSource={this.state.dataSource} columns={this.state.tblColumns} />
                            </Card>
                        </Col>
                        <Col span={14}>
                            <List
                                itemLayout="horizontal"
                                header={
                                    <div>
                                        <label className="job__title">日志列表</label>
                                        <Input.Search
                                            placeholder="筛选列表"
                                            onSearch={val => this.filterLog(val)}
                                            style={{ width: 200 }}
                                        />
                                    </div>
                                }
                                bordered
                                pagination
                                dataSource={this.state.logs}
                                renderItem={item => (<List.Item>
                                    <List.Item.Meta
                                        avatar={item.description.indexOf("调用成功") !== -1 ? successIcon : errorIcon}
                                        title={item.title}
                                        description={item.description}
                                    />
                                </List.Item>)}
                            />
                        </Col>

                    </Col>

                </Row>
            </div>


        );
    }
}

export default Job;