const {getData} = require('./dialogflow')

const getIA = (message) => new Promise((resolve, reject) => {
    let resData = {replyMessage: '', media: null, trigger: null}
    getData(message, (dt) => {
        resData = {...resData, ...dt}
        resolve(resData)
    })
})

const bothResponse = async (message) => {
    const data = await getIA(message)
    if(data && data.media){
        return {...data,...{media:file}}
    }
    return data
}

module.exports = {bothResponse}
