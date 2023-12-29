// persistConfig.js
import storage from 'redux-persist/lib/storage';

// 配置持久化存储
interface PersistConfigI {
    key: string
    storage: any
    whitelist: string[]
}
const persistConfig: PersistConfigI = {
    key: 'testStorage',
    storage,
    whitelist: ['user'],
}

export default persistConfig;