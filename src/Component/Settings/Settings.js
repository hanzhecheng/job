import React, { Component } from 'react';
import { Input, Card, Table, Select } from 'antd';
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
    handleChange = (value) => {
        this.props.onUpdateChannel(value)
    }
    render() {
        return (
            <Card title="" bordered className="job__settings"
                extra={<div className="job_apiurl">
                    <span>门店:</span>
                    <Select defaultValue="3" className="job__settings__channel" onChange={this.handleChange}>
                        <Option value="3">美罗观前店</Option>
                        <Option value="5">美罗新区店</Option>
                    </Select>
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