import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Popconfirm, message, Popover, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { rightsApi } from '@/utils/supabaseServer'

interface TableItem {
    id: number;
    title: string;
    key: string;
    pagepermisson: number;
    grade: number;
    children?: TableItem[] | null
    rightid?: number
}

export default function RightList() {
    const [tableData, setTableData] = useState<TableItem[]>([])
    // 获取数据
    useEffect(() => {
        rightsApi.queryRightsWithChildren().then((res: any) => {
            setTableData(res.map((item: TableItem) => {
                if (item.children?.length === 0) {
                    item.children = null
                }
                return item
            }))
        })
    }, [])
    // 删除权限
    const deleteRight = (item: TableItem) => {
        // 删除子级权限
        if (item.rightid) {
            const newData = tableData.map((ele: TableItem) => {
                if (ele.id === item.rightid) {
                    rightsApi.deleteRight(item.id).then(res => {
                        if (res) {
                            ele.children = ele.children?.filter((data: TableItem) => data.id !== item.id)
                        }
                    })
                }
                return ele
            })
            setTableData(newData)
        }
    }
    // 改变权限
    const changeRight = (item: TableItem) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        rightsApi.updateRight(item.id, item.pagepermisson).then(res=>{
            if(res){
                setTableData([...tableData])
            }
        })
    }

    // table配置
    const columns: ColumnsType<TableItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: (_, data: TableItem) => {
                return <Tag color="orange">{data.key}</Tag>
            },
        },
        {
            title: '操作',
            render: (_, data: TableItem) => {
                return <div className='flex flex-row gap-3'>
                    <Popconfirm
                        title="删除权限"
                        description="您确定要删除你该权限？"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        cancelText="取消"
                        okText="确定"
                        okType="danger"
                        onConfirm={() => deleteRight(data)}
                    >
                        <Button danger shape='circle' icon={<DeleteOutlined />}></Button>
                    </Popconfirm>
                    <Popover content={<div className='flex flex-col items-center justify-center gap-3 '>
                        <h1>编辑权限</h1>
                        <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={() => changeRight(data)} checked={data.pagepermisson === 1} />
                    </div>} trigger="click">
                        <Button shape='circle' disabled={data.grade === 2} icon={<EditOutlined />}></Button>
                    </Popover>
                </div>
            },
        },
    ]
    return (
        <div>
            <Table columns={columns} dataSource={tableData} />
        </div>
    )
}
