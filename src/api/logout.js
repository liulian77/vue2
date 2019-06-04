import { post } from './restful'

export const logout = () => new Promise((resolve, reject) => {
    let data = { "logout()": ["login_logout"] }
    post(data)
        .then(resolve)
        .catch(reject)
})