import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select, Image } from 'antd'
import { useSelector } from 'react-redux'

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

interface UserInfoFormProps {
    regions: RegionI[] | null;
    roles: RoleI[] | null;
    userInfo: any;
}



const UserInfoForm = forwardRef((props: UserInfoFormProps, ref: any) => {
    const [isDisable, setIsDisable] = useState<boolean>(false)
    const [userAvatar, setUserAvatar] = useState<string>('')
    // redux
    const userStore = useSelector((state: any) => state.user)
    const { roleid, region } = userStore

    useEffect(() => {
        if (ref && props.userInfo) {
            ref.current.setFieldsValue(props.userInfo)
            setUserAvatar(props.userInfo.avatar)
        }
    }, [props.userInfo])
    return (
        <Form
            ref={ref}
            labelCol={{ span: 4 }}
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
            >
                <Input placeholder='请输入用户名' />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password placeholder='请输入密码' />
            </Form.Item>
            <Form.Item
                label="区域"
                name="region"
                rules={[{ required: !isDisable, message: '请选择区域' }]}
            >
                <Select
                    style={{ width: '100%' }}
                    allowClear
                    options={props.regions?.map((item: RegionI) => {
                        return {
                            value: item.title,
                            label: item.title,
                            disabled: region ? item.title !== region : false
                        }
                    })}
                    disabled={isDisable}
                />
            </Form.Item>
            <Form.Item
                label="角色"
                name="roleid"
                rules={[{ required: true, message: '请选择角色' }]}
            >
                <Select
                    style={{ width: '100%' }}
                    allowClear
                    options={props.roles?.map((item: RoleI) => {
                        return {
                            value: item.id,
                            label: item.roleName,
                            disabled: roleid === 1 ? false : item.id !== roleid
                        }
                    })}
                    onChange={(value: number) => {
                        setIsDisable(value === 1)
                    }}
                />
            </Form.Item>
            <Form.Item
                label="头像"
                name="avatar"
            >
                <div>
                    <Input placeholder='请粘贴您喜欢的图片地址粘贴到此' value={userAvatar} onChange={(e) => {
                        setUserAvatar(e.target.value)
                    }} />
                    <Image
                        width={200}
                        src={userAvatar}
                    />
                </div>
            </Form.Item>
        </Form>
    )
})

export default UserInfoForm