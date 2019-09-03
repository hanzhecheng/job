import React, { Component } from 'react';
import { Input, Card, Table, Select, Icon, Popover } from 'antd';
import './Settings.css';
const Option = Select.Option;
class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //table列应放在子组件中,数据来源放在父组件
            tblColumns: [
                {
                    title: '任务名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: "200"
                },
                {
                    title: '每日任务时间',
                    dataIndex: 'time',
                    key: 'time',
                    render: (text, record) => (
                        <div className="job__table__column">
                            <Input value={text.hour} onChange={this.changeValue.bind(this, 'hour', record.key, 'change')}
                                onBlur={this.changeValue.bind(this, 'hour', record.key, 'blur')} /><span>时</span>
                            <Input value={text.minute} onChange={this.changeValue.bind(this, 'minute', record.key, 'change')}
                                onBlur={this.changeValue.bind(this, 'minute', record.key, 'blur')} /><span>分</span>
                        </div>
                    )
                },
                {
                    title: "每日任务次数",
                    dataIndex: 'count',
                    key: 'count',
                    render: (text, record) => (
                        <div className="job__table__column">
                            <Input value={text} onChange={this.changeValue.bind(this, 'count', record.key, 'change')}
                                onBlur={this.changeValue.bind(this, 'count', record.key, 'blur')} /><span>次</span>
                            <Popover content={this.state.tipcontent} title="执行时间计算规则" trigger="hover">
                                <Icon type="question-circle" />
                            </Popover>

                        </div>
                    )
                }
            ],
            tipcontent:'执行时间为:(24-每日任务时间小时数)/每日任务次数.例:每日任务时间7时0分,每日任务次数4次,时间间隔=(24-7)/4=4.25(舍小数)=4,执行时间：["7:0:0", "11:0:0", "15:0:0", "19:0:0"]'
        }
    }
    changeValue = (val, index, type, event) => {
        this.props.onChangeValue(val, index, type, event)
    }
    changeApiUrl = (val, type, event) => {
        this.props.onChangeApiUrl(val, type, event)
    }
    handleChange = (value) => {
        this.props.onUpdateChannel(value)
    }
    render() {
        return (
            <Card title="" bordered className="job__settings"
                extra={<div className="job_apiurl">
                    <span>门店:</span>
                    <Select className="job__settings__channel" onChange={this.handleChange} disabled={this.props.isStart}>
                        <Option value="3">xxx</Option>
                        <Option value="5">xxx</Option>
                    </Select>
                    <span>接口地址:</span>
                    <Input value={this.props.apiUrl.origin} disabled={this.props.isStart}
                        onChange={this.changeApiUrl.bind(this, 'origin', 'change')}
                        onBlur={this.changeApiUrl.bind(this, 'origin', 'blur')} />
                    <span>端口:</span>
                    <Input value={this.props.apiUrl.port} disabled={this.props.isStart}
                        onChange={this.changeApiUrl.bind(this, 'port', 'change')}
                        onBlur={this.changeApiUrl.bind(this, 'port', 'blur')} />
                </div>}>
                <Table dataSource={this.props.dataSource} columns={this.state.tblColumns} />
            </Card>
        )
    }
}
export default Settings