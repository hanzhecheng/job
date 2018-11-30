import React, { Component } from 'react';
import { Input, Card, Table } from 'antd';
import './Settings.css';
class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
        }
    }
    changeValue = (val, index, type, event) => {
        this.props.onChangeValue(val, index, type, event)
    }
    changeApiUrl = (val, type, event) => {
        this.props.onChangeApiUrl(val, type, event)
    }
    render() {
        return (
            <Card title="任务设置" bordered className="job__settings"
                extra={<div className="job_apiurl">
                    <span>接口地址:</span>
                    <Input value={this.props.apiUrl.origin}
                        onChange={this.changeApiUrl.bind(this, 'origin', 'change')}
                        onBlur={this.changeApiUrl.bind(this, 'origin', 'blur')} />
                    <span>端口:</span>
                    <Input value={this.props.apiUrl.port}
                        onChange={this.changeApiUrl.bind(this, 'port', 'change')}
                        onBlur={this.changeApiUrl.bind(this, 'port', 'blur')} />
                </div>}>
                <Table dataSource={this.props.dataSource} columns={this.state.tblColumns} />
            </Card>
        )
    }
}
export default Settings