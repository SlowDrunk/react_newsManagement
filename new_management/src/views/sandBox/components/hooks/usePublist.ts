import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'

export interface Categories {
    id: number
    title: string
    value: string
}

export interface Article {
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

export function usePublishTable(type: number) {
    const [tableData, setTableData] = useState<Article[]>([])
    const userStore = useSelector((state: any) => state.user)
    useEffect(() => {
        axios.get(`http://localhost:3004/news?publishState=${type}&author=${userStore.username}&_expand=category`).then(res => {
            setTableData(res.data)
        })
    }, [userStore.username, type])
    const changePublishState = (data: Article, state: number) => {
        axios.patch(`http://localhost:3004/news/${data.id}`, { publishState: state }).then((res) => {
            if (res.status >= 200) {
                message.success('操作成功')
                setTableData(tableData.filter((ele: Article) => ele.id !== data.id))
            }
        }).catch(() => {
            message.error('提交失败')
        })
    }
    const deleteNews = (data: Article) => {
        axios.delete(`http://localhost:3004/news/${data.id}`).then((res) => {
            if (res.status >= 200) {
                message.success('删除成功')
                setTableData(tableData.filter((ele: Article) => ele.id !== data.id))
            }
        }).catch(() => {
            message.error('删除失败')
        })
    }
    return {
        tableData,
        changePublishState,
        deleteNews
    }
}