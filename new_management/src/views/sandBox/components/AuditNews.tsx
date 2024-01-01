import React, { useEffect, useState } from 'react'
import { Table, message, Tag, Modal, Input, Button } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios';
const { TextArea } = Input
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

export default function AuditNews() {
    const [tableData, setTableData] = useState<Article[]>([])
    const userStore = useSelector((state: any) => state.user)
    const history = useHistory()
    const [reson, setReson] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [currentArticle, setCurrentArticle] = useState<Article>()
    // 获取数据
    useEffect(() => {
        let isMonted = true
        if (!isMonted) return
        axios.get(`http://localhost:3004/news?auditState=1&_expand=category`).then(res => {
            if (res.status >= 200) {
                setTableData(userStore.roleId === 1 ? res.data : [
                    ...res.data.filter((item: Article) => item.author === userStore.username),
                    ...res.data.filter((item: Article) => item.region === userStore.region && item.roleId === 3),
                ])
            } else {
                message.error('获取新闻列表失败')
            }
        }).catch(() => {
            message.error('获取新闻列表失败')
        }).finally(() => {
            isMonted = false
        })
    }, [userStore])

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
                return <Tag color='gold'>{data.category.title}</Tag>
            }
        },
        {
            title: '操作',
            render: (_, data: Article) => {
                return <div className='flex flex-row gap-3'>
                    <Button shape='circle' icon={<CheckCircleOutlined />} onClick={() => handleState(data, 2, 1)}></Button>
                    <Button danger shape='circle' icon={<CloseCircleOutlined />} onClick={() => {
                        setIsModalOpen(true)
                        setCurrentArticle(data)
                    }}></Button>
                </div>
            },
        },
    ]

    const handleState = (item: Article, auditState: number, publishState: number) => {
        let obj: any
        if (auditState !== 2) {
            if (!reson) {
                message.error('请填写驳回意见')
                return
            }
            obj = {
                auditState,
                publishState,
                reson,
            }
        } else {
            obj = {
                auditState,
                publishState,
            }
        }
        axios.patch(`http://localhost:3004/news/${item.id}`, obj).then((res) => {
            if (res.status >= 200) {
                setTableData(tableData.filter((ele: Article) => ele.id !== item.id))
                if (auditState === 2) {
                    message.success('审核已通过')
                } else {
                    message.error('审核已驳回')
                }
                history.push('/audit-manage/list')
            }
        }).catch(() => {
            message.error('提交失败')
        })

    }
    return (
        <div>
            <Table columns={columns} dataSource={tableData} rowKey={(item) => item.id} />
            <Modal title="请填写驳回原因" cancelText='取消' okText='确定' okType={'danger'} open={isModalOpen} onOk={() => {
                handleState(currentArticle!, 3, 0)
                setIsModalOpen(false)
            }} onCancel={() => setIsModalOpen(false)}>
                <TextArea rows={4} value={reson} onChange={(e) => { setReson(e.target.value) }}></TextArea>
            </Modal>
        </div>
    )
}
