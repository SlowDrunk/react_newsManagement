import axios from 'axios';

const instance = axios.create({
  // 在这里可以设置一些全局的配置，例如 baseURL、timeout 等
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理，例如添加 token、修改 headers 等
    // ...

    return config;
  },
  (error) => {
    // 对请求错误做一些处理
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做一些处理，例如解析数据、处理错误等
    // ...

    return response.data;
  },
  (error) => {
    // 对响应错误做一些处理
    return Promise.reject(error);
  }
);

// 封装请求函数
const request = (config:any) => {
  // 在这里可以设置一些特定请求的配置，例如 method、headers、data 等
  // ...

  return instance(config);
};

export default request;
