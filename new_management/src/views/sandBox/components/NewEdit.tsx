import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Select, message } from 'antd';
import RichEditor from '@/components/RichEditor';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

interface Categories {
    id: number
    title: string
    value: string
}

interface BaseInfo {
    title: string
    categoryId: number
}

export default function NewEdit() {
    const [newsClassfiy, setNewsClassfiy] = useState<Categories[]>()
    const [baseInfo, setBaseInfo] = useState<BaseInfo>()
    const [editorState, setEditorState] = useState<string>()
    const [flag, setFlag] = useState<string>('save')
    const userStore = useSelector((state: any) => state.user)
    const routerParams = useParams() as any
    // 如果有赋值
    useEffect(() => {
        if (routerParams.id) {
            axios.get(`http://localhost:3004/news/?id=${routerParams.id}`).then(res => {
                if (res.data.length > 0) {
                    setBaseInfo({
                        title: res.data[0].title,
                        categoryId: res.data[0].categoryId
                    })
                    setEditorState(res.data[0].content)
                }
            })
        }
    }, [routerParams])

    useEffect(() => {
        let isMonted = true
        if (isMonted) {
            axios.get('http://localhost:3004/categories').then((res) => {
                setNewsClassfiy(res.data)
            }).catch(() => {
                message.error('获取分类信息失败！')
            }).finally(() => {
                isMonted = false
            })
        }
    }, [])

    // 根据情况获取参数值
    const setParams = () => {
        const defaultInfo = { ...baseInfo, content: editorState }
        if (flag === 'save') {
            return {
                ...defaultInfo,
                region: userStore.region ? userStore.region : '全球',
                author: userStore.username,
                roleId: userStore.roleId,
                auditState: 0,
                publishState: 0,
                createTime: Date.now(),
                star: 0,
                view: 0,
                publishTime: 0
            }
        } if (flag === 'draft') {
            return {
                ...defaultInfo,
                region: userStore.region ? userStore.region : '全球',
                author: userStore.username,
                roleId: userStore.roleId,
                auditState: 0,
                publishState: 0,
                createTime: Date.now(),
                star: 0,
                view: 0,
                publishTime: 0
            }
        }
    }
    useEffect(() => {
        setParams()
    }, [baseInfo, editorState, flag])
    // 提交
    const sendNews = () => {
        if (!baseInfo || baseInfo.title === '' || !editorState || editorState.trim() === '<p></p>') {
            message.error('请填写完整信息')
            return
        }
        if (routerParams.id) {
            axios.patch(`http://localhost:3004/news/${routerParams.id}`, { ...baseInfo, constent: editorState }).then((res) => {
                console.log(res);
                if (res.status >= 200) {
                    let text = flag === 'draft' ? '提交审核成功，您可以在审核列表查看进度' : '保存草稿成功，您可以在草稿箱中查看新闻'
                    message.success(text)
                }
            }).catch(() => {
                message.error('提交失败')
            })
        } else {
            axios.post('http://localhost:3004/news', setParams()).then((res) => {
                console.log(res);
                if (res.status >= 200) {
                    let text = flag === 'draft' ? '提交审核成功，您可以在审核列表查看进度' : '保存草稿成功，您可以在草稿箱中查看新闻'
                    message.success(text)
                }
            }).catch(() => {
                message.error('提交失败')
            })
        }
    }
    return (
        <div className='flex flex-col'>
            <div className='flex flex-col gap-3 mb-[12px]'>
                <div className='text-[18px] font-semibold'>基本信息</div>
                <div className='text-[14px] text-[skyblue]'>新闻标题、新闻分类</div>
            </div>
            <div className='flex flex-col gap-3 mb-4'>
                <div className='flex flex-row items-center'>
                    <span className='w-[100px]'>新闻标题</span>
                    <Input placeholder='请输入新闻标题' value={baseInfo?.title} onChange={(e) => {
                        setBaseInfo({
                            title: e.target.value,
                            categoryId: baseInfo?.categoryId ? baseInfo.categoryId : 0
                        })
                    }} />
                </div>
                <div className='flex flex-row items-center'>
                    <span className='w-[100px]'>新闻分类</span>
                    <Select
                        style={{ width: '100%' }}
                        allowClear
                        placeholder="请选择新闻分类"
                        options={newsClassfiy?.map((item: Categories) => {
                            return {
                                value: item.id,
                                label: item.title,
                            }
                        })}
                        value={baseInfo?.categoryId}
                        onChange={(e) => {
                            setBaseInfo({
                                title: baseInfo!.title ? baseInfo!.title : '',
                                categoryId: e
                            })
                        }}
                    />
                </div>
            </div>
            <div>

                <div className='flex flex-col gap-3 mb-[12px]'>
                    <div className='text-[18px] font-semibold'>新闻主体</div>
                    <div className='text-[14px] text-[skyblue]'>在此处编写新闻内容</div>
                </div>
                <div className='m-[24px]'>
                    <RichEditor content={editorState} setEditorContent={(value: string) => { setEditorState(value) }}></RichEditor>
                </div>
            </div>
            <div className='w-full flex flex-row justify-evenly'>
                <Button className='bg-[#4096ff] text-[#ffffff] mb-3' onClick={() => {
                    setFlag('save')
                    sendNews()
                }}>保存草稿</Button>
                <Button danger onClick={() => {
                    setFlag('draft')
                    sendNews()
                }}>提交审核</Button>
            </div>
        </div>
    )
}
