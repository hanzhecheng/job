import React, { Component } from 'react';
import './JobList.css';
import { List, Input, Avatar } from 'antd';
class JobList extends Component {  
    //过滤table数据
    filterLog = (val) => {
        this.props.onFilter(val)
    }
    render() {
        //成功icon
        const successIcon = <Avatar icon="check-circle" style={{ backgroundColor: '#fff', color: '#52c41a' }}></Avatar>
        //失败icon
        const errorIcon = <Avatar icon="close-circle" style={{ backgroundColor: '#fff', color: 'rgba(181, 44, 44, 1)' }}></Avatar>
        return (
            <List
                itemLayout="horizontal"
                header={
                    <div>
                        <label className="job__title">日志列表</label>
                        <Input.Search
                            placeholder="筛选列表"
                            onSearch={val => this.filterLog(val)}
                            className="job__input--search"
                        />
                    </div>
                }
                bordered
                pagination
                dataSource={this.props.dataSource}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={item.description.indexOf("调用成功") !== -1 ? successIcon : errorIcon}
                            title={item.title}
                            description={item.description}
                        />
                    </List.Item>
                )}
            />
        )
    }
}
export default JobList