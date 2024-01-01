import React from 'react'
import { usePublishTable } from '../hooks/usePublist'
import type { Article } from '../hooks/usePublist'
import { Table, Tag, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function PublistedList() {
    const { tableData, changePublishState } = usePublishTable(2)
    // table配置
    const columns: ColumnsType<Article> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            key: 'title',
            render: (_, data) => (<a className='text-[skyblue]' href={`newsPrevirw/${data.id}`}>{data.title}</a>)
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (_, data) => {
                return <Tag color='geekblue'>{data.category.title}</Tag>
            }
        },
        {
            title: '操作',
            render: (_, data: Article) => {
                return <div className='flex flex-row gap-3'>
                    <Button danger onClick={() => changePublishState(data, 3)}>下线</Button>
                </div>
            },
        },
    ]
    return (
        <div>
            <Table columns={columns} dataSource={tableData} rowKey={(item) => item.id} />
        </div>
    )
}
