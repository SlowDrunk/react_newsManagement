import React, { useEffect, useState } from 'react'
import { Table, Button, Popconfirm, message, Modal, Tree } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { UnorderedListOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'

interface TableItem {
    id: number;
    roleName: string;
    roleType: number;
    rights: string[]
}

interface RightsItem {
    id: number;
    title: string;
    key: string;
    pagepermisson: number;
    grade: number;
    children?: TableItem[] | null
    rightId?: number
}

export default function RoleList() {
    // 表格数据
    const [tableData, setTableData] = useState<TableItem[]>([])
    // 权限数据
    const [rightsData, setRightsData] = useState<any[]>([])
    // 控制弹框显隐
    const [isVisible, setIsVisible] = useState<boolean>(false)
    // 当前编辑的角色
    const [currentRole, setCurrentRole] = useState<TableItem>({} as TableItem)
    // 获取数据
    useEffect(() => {
        axios.get('http://localhost:3004/roles').then(res => {
            if (res.status === 200) {
                setTableData(res.data)
            } else {
                message.error('获取权限列表失败')
            }
        }).then(() => {
            axios.get('http://localhost:3004/rights?_embed=children').then(res => {
                if (res.status === 200) {
                    setRightsData(res.data.map((item: RightsItem) => {
                        if (item.children?.length === 0) {
                            item.children = null
                        }
                        return item
                    }))
                } else {
                    message.error('获取权限列表失败')
                }
            })
        })
    }, [])

    // 删除角色
    const deleteRole = (item: TableItem) => {
        axios.delete(`http://localhost:3004/roles/${item.id}`).then(res => {
            if (res.status === 200) {
                message.success('删除成功')
                setTableData(tableData.filter((ele: TableItem) => ele.id !== item.id))
            }
            else {
                message.error('删除失败')
            }
        })
    }
    // 点击确定时的函数
    const handleOk = () => {
        axios.patch(`http://localhost:3004/roles/${currentRole.id}`, { rights: currentRole.rights }).then((res) => {
            if (res.status === 200) {
                message.success('更新成功')
                setTableData(tableData.map((item: TableItem, index: number) => {
                    if (item.id === currentRole.id) {
                        return {
                            ...item,
                            rights: currentRole.rights
                        }
                    } else {
                        return item
                    }
                }))
            }
        })
        setIsVisible(false)
    }
    // 关闭弹框
    const handleCancel = () => {
        setIsVisible(false)
        setCurrentRole({} as TableItem)
    }
    // 编辑当前角色的权限
    const handleRights = (checkedkeys: any) => {
        setCurrentRole({ ...currentRole, rights: checkedkeys })

    }
    // table配置
    const columns: ColumnsType<TableItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
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
                        onConfirm={() => deleteRole(data)}
                    >
                        <Button danger shape='circle' icon={<DeleteOutlined />}></Button>
                    </Popconfirm>
                    <Button shape='circle' icon={<UnorderedListOutlined />} onClick={() => {
                        setIsVisible(true)
                        setCurrentRole(data)
                    }}></Button>
                </div>
            },
        },
    ]
    return (
        <div>
            <Table columns={columns} dataSource={tableData} rowKey={(item) => item.id} />
            <Modal centered title="权限分配" cancelText='取消' okText='确定' okType={'danger'} open={isVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkStrictly
                    onCheck={handleRights}
                    checkedKeys={currentRole?.rights}
                    treeData={rightsData}
                />
            </Modal>
        </div>
    )
}
