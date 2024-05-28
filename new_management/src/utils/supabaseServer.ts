import { createClient } from '@supabase/supabase-js'
import { message } from 'antd'

const supabase = createClient('https://pliearsnqccuykfbpigz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaWVhcnNucWNjdXlrZmJwaWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYxMjg3ODAsImV4cCI6MjAzMTcwNDc4MH0.VYKvnNANXd7TiblmubDLArzDmNKCoPQYkpA1h0Epby4')
type userItem = {
    id: number;
    username: string;
    password: string;
    rolestate?: boolean;
    default?: boolean;
    region?: string;
    roleid?: number;
    avatar?: string;
}

// 用户相关
export const usersApi = {
    getAllUsers: async () => {
        let { data: users, error } = await supabase
            .from('users')
            .select('*')
        if (error) {
            message.error('获取用户列表失败')
        }
    },
    // 登陆
    login: async (account: string, password: string) => {
        let { data: result, error } = await supabase.from('users').select("*").eq('username', account)
        if (!error) {
            if (result?.length) {
                return result.find((item: userItem) => item.password === password) ? result.find((item: userItem) => item.password === password) : null
            } else {
                message.error('账号不存在')
            }
        } else {
            message.error('登录失败')
        }
    },
    // 注册
    signUp: async (userInfo: userItem) => {
        let { data: user, error: Error } = await supabase.from('users').select("*").eq('username', userInfo.username)
        if (user?.length) {
            message.error('该用户名已被注册')
            return false
        }
        let { data: result, error } = await supabase.from('users').insert([{ ...userInfo }])
        if (!error) {
            message.success('注册成功')
            return true
        } else {
            message.error('注册失败')
            return true
        }
    },
    // 注销
    deleteUser: async (userId: number) => {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId)
        if (!error) {
            message.success('注销成功')
        } else {
            message.error('操作失败')
        }

    },
    // 更新用户
    updateUser: async (userId: number, userInfo: userItem) => {

        const { data, error } = await supabase
            .from('users')
            .update({ ...userInfo })
            .eq('id', userId)
            .select()
        if (error) {
            message.error('更新失败')
            return null
        } else {
            return data
        }
    }
}
// 角色相关
export const rolesApi = {
    getAllRoles: async () => {
        let { data: roles, error } = await supabase
            .from('roles')
            .select('*')
        if (error) {
            message.error('获取角色列表失败')
        } else {
            return roles
        }
    },
    // 获取当前角色信息
    getCurrentRole: async (roleId: number) => {
        let { data: roles, error } = await supabase
            .from('roles')
            .select('*')
            .eq('id', roleId)
        if (error) {
            message.error('获取角色列表失败')
        } else {
            return roles
        }
    },
    deleteRole: async (roleId: number) => {

        const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', roleId)
        if (!error) {
            message.success('删除成功')
            return true
        } else {
            message.error('操作失败')
            return false
        }

    },
    updatedRole: async (roleId: number, check: string[]) => {
        const { data, error } = await supabase
            .from('roles')
            .update({ right: check })
            .eq('id', roleId)
            .select()

        if (error) {
            message.error('更新失败')
            return false
        } else {
            message.success('更新成功')
            return true
        }

    },
}
// 权限相关
export const rightsApi = {
    getAllRights: async () => {
        let { data: rights, error } = await supabase
            .from('rights')
            .select('*')
        if (!error) {
            return rights
        } else {
            message.error('获取权限列表失败')
            return null
        }
    },
    // 获取当前角色权限
    getCurrentRoleRights: async (rightid: number) => {
        let { data: rights, error } = await supabase
            .from('rights')
            .select("*")
            .eq('id', rightid)
        if (!error) {
            return rights || null;
        } else {
            message.error('获取权限列表失败')
            return null
        }
    },
    // 删除权限
    deleteRight: async (rightId: number) => {
        const { error } = await supabase
            .from('rights')
            .delete()
            .eq('id', rightId)
        const { error: childrenError } = await supabase.from('children').delete().eq('rightid', rightId)
        if (!error || childrenError) {
            message.success('删除成功')
            return true
        } else {
            message.error('删除失败')
            return false
        }
    },
    // 更改权限
    updateRight: async (rightId: number, pagepermisson: number) => {

        const { data, error } = await supabase
            .from('rights')
            .update({ pagepermisson, })
            .eq('id', rightId)
            .select()
        if (error) {
            message.error('更新失败')
            return null
        } else {
            return data
        }
    },
    queryRightsWithChildren: async () => {
        const allRight = await rightsApi.getAllRights()
        let { data: AllChildren, error } = await supabase
            .from('children')
            .select('*')
        if (!error) {
            if (!allRight) return
            allRight.forEach(item => {
                item.children = AllChildren?.filter((ele: any) => ele.rightid === item.id) || []
            })
            return allRight
        } else {
            message.error('获取权限列表失败')
            return null
        }
    }

}