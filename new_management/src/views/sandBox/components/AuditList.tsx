import React, { useEffect, useState } from 'react'
import { Table, message, Tag, Button } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios';

interface Categories {
    id: number
    title: string
    value: string
}

interface Article {
    title: string;
    categoryId: number;
    category: Categories;
    content: string;
    region: string;
    author: string;
    roleId: number;
    auditState: number;
    publishState: number;
    createTime: number;
    star: number;
    view: number;
    id: number;
    publishTime: number;
}

export default function AuditList() {
    const [tableData, setTableData] = useState<Article[]>([])
    const userStore = useSelector((state: any) => state.user)
    const history = useHistory()
    // 获取数据
    useEffect(() => {
        let isMonted = true
        if (!isMonted) return
        axios.get(`http://localhost:3004/news?author=${userStore.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            if (res.status >= 200) {
                setTableData(res.data)
            } else {
                message.error('获取新闻审核列表失败')
            }
        }).catch(() => {
            message.error('获取新闻审核列表失败')
        }).finally(() => {
            isMonted = false
        })
    }, [])
    // 关于color的map
    const colorMap: any = {
        0: 'blue', // 未审核
        1: 'gold', //审核中
        2: 'green', // 已通过
        3: 'red', // 未通过
    }

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
            title: '当前状态',
            dataIndex: 'publishState',
            key: 'publishState',
            render: (_, data: Article) => {
                const tagColor: string = colorMap[data.auditState]
                return <Tag color={tagColor}>{data.auditState <= 1 ? '审核中' : data.auditState === 2 ? '已通过' : '未通过'}</Tag>
            }
        },
        {
            title: '未通过原因',
            dataIndex: 'reson',
            key: 'reson',
            render: (reson: string) => {
                return <div className='text-[#d74242]'>{reson ? reson : ''}</div>
            }
        },
        {
            title: '操作',
            render: (_, data: Article) => {
                return <div className='flex flex-row gap-3'>
                    <Button className='bg-[#4096ff] text-[#ffffff] hover:bg-[#fcfcfc]' onClick={() => editNews(data)}>{data.auditState <= 1 ? '撤销' : data.auditState === 2 ? '发布' : '修改'}</Button>
                </div>
            },
        },
    ]
    // 发布
    const editNews = (data: Article) => {
        let obj: any
        if (data.auditState <= 1) {
            obj = {
                auditState: 0,
                publishState: 0
            }
        } else if (data.auditState === 2) {
            obj = {
                publishState: 1,
                publishTime: Date.now()
            }
        } else {
            history.push(`/news-manage/add/${data.id}`)
        }
        axios.patch(`http://localhost:3004/news/${data.id}`, obj).then((res) => {
            if (res.status >= 200) {
                message.success('操作成功')
                setTableData([...tableData])
            }
        }).catch(() => {
            message.error('提交失败')
        })
    }

    return (
        <div>
            <Table columns={columns} dataSource={tableData} rowKey={(item) => item.id} />
        </div>
    )
}
