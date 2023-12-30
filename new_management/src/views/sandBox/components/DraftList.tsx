import React, { useEffect, useState } from 'react'
import { Table, message, Tag, Popconfirm, Button } from 'antd'
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
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

export default function DraftList() {
    const [tableData, setTableData] = useState<Article[]>([])
    const [newsClassfiy, setNewsClassfiy] = useState<Categories[]>()
    const userStore = useSelector((state: any) => state.user)
    const history = useHistory()
    // 获取数据
    useEffect(() => {
        let isMonted = true
        if (!isMonted) return
        axios.get(`http://localhost:3004/news?auditState=0&author=${userStore.username}`).then(res => {
            if (res.status >= 200) {
                setTableData(res.data)
            } else {
                message.error('获取新闻草稿列表失败')
            }
        }).catch(() => {
            message.error('获取新闻草稿列表失败')
        }).then(() => {
            axios.get('http://localhost:3004/categories').then(res => {
                if (res.status >= 200) {
                    setNewsClassfiy(res.data)
                } else {
                    message.error('获取新闻分类失败')
                }
            }).catch(() => {
                message.error('获取新闻分类失败')
            })
        }).finally(() => {
            isMonted = false
        })
    }, [])

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
            render: (data) => {
                const title = newsClassfiy?.find((ele: Categories) => ele.id === data)?.title ? newsClassfiy?.find((ele: Categories) => ele.id === data)?.title : ''
                return <Tag color='green'>{title}</Tag>
            }
        },
        {
            title: '操作',
            render: (_, data: Article) => {
                return <div className='flex flex-row gap-3'>
                    <Popconfirm
                        title="删除权限"
                        description="您确定要删除你该权限？"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        cancelText="取消"
                        okText="确定"
                        okType="danger"
                        onConfirm={() => deleteNews(data)}
                    >
                        <Button danger shape='circle' icon={<DeleteOutlined />}></Button>
                    </Popconfirm>
                    <Button shape='circle' icon={<EditOutlined />} onClick={() => {
                        history.push(`/news-manage/add/${data.id}`)
                    }}></Button>
                    <Button className='bg-[#4096ff] text-[#ffffff] hover:bg-[#fcfcfc]' shape='circle' icon={<VerticalAlignTopOutlined />} onClick={() => {
                        publishNews(data)
                    }}></Button>
                </div>
            },
        },
    ]
    // 删除
    const deleteNews = (data: Article) => {
        console.log(data)
        axios.delete(`http://localhost:3004/news/${data.id}`).then(() => {
            setTableData(tableData.filter((item: Article) => item.id !== data.id))
            message.success('删除成功')
        }).catch(() => {
            message.error('删除失败')
        })
    }
    // 发布
    const publishNews = (data: Article) => {
        axios.patch(`http://localhost:3004/news/${data.id}`, { publishState: 1 }).then((res) => {
            if (res.status >= 200) {
                message.success('提交审核成功，您可以在审核列表查看进度')
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
