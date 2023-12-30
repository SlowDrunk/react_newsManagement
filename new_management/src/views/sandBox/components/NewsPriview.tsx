import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { message, Descriptions, DescriptionsProps } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

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

export default function NewsPriview() {
    const routerParams = useParams()
    const userStore = useSelector((state: any) => state.user)
    const [news, setNews] = useState<Article>()
    const [newsClassfiy, setNewsClassfiy] = useState<Categories[]>()
    const history = useHistory()
    // 获取新闻详情
    useEffect(() => {
        // @ts-ignore
        axios.get(`http://localhost:3004/news?id=${routerParams.id}&author=${userStore.username}`).then((res) => {
            if (res.status >= 200) {
                setNews(res.data[0])
            }
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
        }).catch(() => {
            message.error('获取数据失败')
        })
    }, [])

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: '作者',
            children: news?.author,
        },
        {
            key: '2',
            label: '新闻分类',
            children: newsClassfiy?.find((ele: Categories) => ele.id === news?.categoryId)?.title,
        },
        {
            key: '3',
            label: '区域',
            children: news?.region,
        },
        {
            key: '4',
            label: '访问量',
            children: news?.view,
        },
        {
            key: '5',
            label: '获赞数量',
            children: news?.star,
        },
    ];


    return (
        <div>
            <div onClick={() => {
                history.goBack()
            }}>
                <ArrowLeftOutlined />
            </div>
            <div className='flex flex-row gap-3'>
                <Descriptions title={news?.title} items={items} />
            </div>
            <div className='h-[1px] w-full bg-slate-400'></div>
            <div className='p-[18px] bg-[#fcfcfc]'>
                <div dangerouslySetInnerHTML={{ __html: news?.content ? news.content : '' }}>
                </div>
            </div>

        </div>
    )
}
