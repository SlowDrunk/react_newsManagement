import React, { useEffect, useState, useRef } from 'react'
import { Table, Avatar, Button, Popconfirm, message, Switch, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons'
import UserInfoForm from '@/components/UserInfoForm'
// @ts-ignore
import defaultAvatar from '@/assets/images/defaultAvatar.jpg'
import { useSelector } from 'react-redux'

interface TableItem {
    id: number; // Optional for new users, as it seems to be autogenerated
    username: string;
    password: string;
    roleState: boolean;
    default: boolean;
    region: string;
    roleId: number;
    avatar: string;
    role: any
}

interface RegionI {
    id: number,
    title: string,
    value: string
}

interface RoleI {
    id: number;
    roleName: string;
    roleType: number;
    rights: string[]
}

export default function UserList() {
    const [tableData, setTableData] = useState<TableItem[]>([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [regions, setRegions] = useState<RegionI[] | null>(null)
    const [roles, setRoles] = useState<RoleI[] | null>(null)
    // 当前操作的用户
    const [currentUser, setCurrentUser] = useState<TableItem | null>()
    // 模态框标题
    const [modalTitle, setModalTitle] = useState<string>('')
    // 表单实例
    const formRef = useRef<any>(null)
    // redux
    const userStore = useSelector((state: any) => state.user)
    const { roleId, region, username } = userStore

    // 获取用户列表数据
    useEffect(() => {
        axios.get('http://localhost:3004/users?_expand=role').then(res => {
            if (res.status === 200) {
                setTableData(roleId === 1 ? res.data : [
                    ...res.data.filter((item: TableItem) => item.username === username),
                    ...res.data.filter((item: TableItem) => item.region === region && item.roleId === 3),
                ])
            } else {
                message.error('获取用户列表失败')
            }
        })
    }, [roleId, region, username])
    // 获取区域信息
    useEffect(() => {
        axios.get('http://localhost:3004/regions').then(res => {
            if (res.status === 200) {
                setRegions(res.data)
            } else {
                message.error('获取区域信息失败')
            }
        })
    }, [])
    // 获取角色列表
    useEffect(() => {
        axios.get('http://localhost:3004/roles').then(res => {
            if (res.status === 200) {
                setRoles(res.data)
            } else {
                message.error('获取角色列表失败')
            }
        })
    }, [])

    // table配置
    const columns: ColumnsType<TableItem> = [
        {
            title: '区域',
            dataIndex: 'region',
            key: 'region',
            render: (data: string) => (<div className='font-semibold'>{data ? data : '无'}</div>)
        },
        {
            title: '角色名称',
            render: (data: TableItem) => (data.role?.roleName)
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (data: string) => {
                return (
                    <div>
                        <Avatar className='bg-[#ccc]' size={48} shape='circle' src={<img src={data ? data : defaultAvatar} alt="avatar" />} icon={<UserOutlined />} ></Avatar>
                    </div >
                )
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',

        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            key: 'roleState',
            render: (_, data: TableItem) => {
                return (<Switch className='bg-[#666]' checkedChildren="开启" disabled={roleId === 3} unCheckedChildren="关闭" checked={data.roleState} onChange={() => upDateUserState(data)} />)
            }
        },
        {
            title: '操作',
            render: (_, data: TableItem) => {
                return <div className='flex flex-row gap-3'>
                    <Popconfirm
                        title="删除用户"
                        description="您确定要删除该用户？"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        cancelText="取消"
                        okText="确定"
                        okType="danger"
                        onConfirm={() => deleteUser(data)}
                    >
                        <Button danger shape='circle' disabled={data.default || roleId === 3} icon={<DeleteOutlined />}></Button>
                    </Popconfirm>

                    <Button shape='circle' disabled={data.default} icon={<EditOutlined />} onClick={() => {
                        setIsModalVisible(true)
                        setCurrentUser(data)
                        setModalTitle('编辑用户')
                    }}></Button>
                </div>
            },
        },
    ]
    // 表单确认
    const handleOk = () => {
        formRef.current.validateFields().then((value: any) => {
            if (modalTitle === '添加用户') {
                const index = tableData.findIndex((item: any) => item.username === value.username)
                if (index >= 0) {
                    message.error('该用户名已存在')
                    return
                }
                // 添加用户
                axios.post('http://localhost:3004/users', {
                    ...value,
                    default: false,
                    role: roles?.filter((item: any) => item.id === value.roleId)[0],
                    roleState: true
                }).then((res) => {
                    if (res.status !== 400) {
                        setTableData([...tableData, res.data])
                        formRef.current.resetFields()
                    }
                })
            } else {
                // 更新用户
                axios.patch(`http://localhost:3004/users/${currentUser!.id}`, {
                    ...value,
                    default: false,
                    role: roles?.filter((item: any) => item.id === value.roleId)[0],
                    roleState: true
                }).then((res) => {
                    if (res.status !== 400) {
                        const newData = tableData.map((ele: TableItem) => {
                            if (ele.id === currentUser!.id) {
                                ele = { ...ele, ...value }
                            }
                            return ele
                        })
                        setTableData(newData)
                        formRef.current.resetFields()
                    }
                })
            }

        }).catch(() => {
            message.error(`${modalTitle}出错啦`)
            return
        })
        setIsModalVisible(false)

    }
    // 删除逻辑
    const deleteUser = (item: TableItem) => {
        axios.delete(`http://localhost:3004/users/${item.id}`).then((res) => {
            if (res.status === 200) {
                setTableData(tableData.filter((val: TableItem) => val.id !== item.id))
                message.success('删除成功')
            }
        }).catch(() => {
            message.error('删除失败')
        })
    }
    // 修改用户状态
    const upDateUserState = (item: TableItem) => {
        item.roleState = !item.roleState
        axios.patch(`http://localhost:3004/users/${item.id}`, { roleState: item.roleState }).then(() => {
            setTableData([...tableData])
            message.success('更新状态成功')
        }).catch(() => {
            message.error('更新状态失败')
        })
    }
    // 表单关闭
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    return (
        <div>
            <Button className='bg-[#4096ff] text-[#ffffff] mb-3' disabled={roleId === 3} onClick={() => {
                setModalTitle('添加用户')
                setIsModalVisible(true)
            }}>添加用户</Button>
            <Table columns={columns} dataSource={tableData} rowKey={(item) => item.id} />
            {/* 表单模态框 */}
            <Modal title={modalTitle} cancelText='取消' okText='确定' okType={'danger'} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <UserInfoForm ref={formRef} userInfo={currentUser} regions={regions} roles={roles} />
            </Modal>
        </div>
    )
}
