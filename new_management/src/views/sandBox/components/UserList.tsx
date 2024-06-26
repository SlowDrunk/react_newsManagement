import React, { useEffect, useState, useRef } from 'react'
import { Table, Avatar, Button, Popconfirm, message, Switch, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons'
import UserInfoForm from '@/components/UserInfoForm'
// @ts-ignore
import defaultAvatar from '@/assets/images/defaultAvatar.jpg'
import { useSelector } from 'react-redux'
import { regionsApi, rolesApi, usersApi } from '@/utils/supabaseServer'

interface TableItem {
    id: number; // Optional for new users, as it seems to be autogenerated
    username: string;
    password: string;
    rolestate: boolean;
    default: boolean;
    region: string;
    roleid: number;
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
    const { roleid, region, username } = userStore

    const fetchData = () => {
        usersApi.getAllUsers().then((res) => {
            if (res) {
                setTableData(roleid === 1 ? res : [
                    ...res.filter((item: TableItem) => item.username === username),
                    ...res.filter((item: TableItem) => item.region === region && item.roleid === 3),
                ])
            }
        })
    }
    // 获取用户列表数据
    useEffect(() => {
        fetchData()
    }, [roleid, region, username])
    // 获取区域信息
    useEffect(() => {
        regionsApi.getAllRegions().then((res) => {
            if (res) {
                setRegions(res)
            }

        }).then(() => {
            rolesApi.getAllRoles().then(roles => {
                if (roles) {
                    setRoles(roles)
                }
            })
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
            dataIndex: 'rolestate',
            key: 'rolestate',
            render: (_, data: TableItem) => {
                return (<Switch className='bg-[#666]' checkedChildren="开启" disabled={roleid === 3} unCheckedChildren="关闭" checked={data.rolestate} onChange={() => upDateUserState(data)} />)
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
                        <Button danger shape='circle' disabled={data.default || roleid === 3} icon={<DeleteOutlined />}></Button>
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
            // debugger
            if (modalTitle === '添加用户') {
                usersApi.signUp({
                    ...value,
                    default: false,
                    rolestate: true
                }).then((res) => {
                    console.log(res)
                })
            } else {
                usersApi.updateUser(currentUser!.id, {
                    ...value,
                    default: false,
                    rolestate: true
                }).then(res => {
                    if (res) {
                        formRef.current.resetFields()
                    }
                })
            }
            formRef.current.resetFields()
            fetchData()
        }).catch(() => {
            message.error(`${modalTitle}出错啦`)
            return
        })
        setIsModalVisible(false)
        fetchData()
    }
    // 删除逻辑
    const deleteUser = (item: TableItem) => {
        usersApi.deleteUser(item.id)
        setTableData(tableData.filter(ele => ele.id !== item.id))
    }
    // 修改用户状态
    const upDateUserState = async (item: TableItem) => {
        item.rolestate = !item.rolestate
        await usersApi.updateUser(item.id, userStore)
        fetchData()
    }
    // 表单关闭
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    return (
        <div>
            <Button className='bg-[#4096ff] text-[#ffffff] mb-3' disabled={roleid === 3} onClick={() => {
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
