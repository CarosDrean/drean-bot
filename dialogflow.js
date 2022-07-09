const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const fs = require('fs')

let sessionClient
let projectID

const getConfig = () => {
    const parseCredentials = JSON.parse(fs.readFileSync(`${__dirname}/chatbotaccount.json`));

    const configuration = {
        credentials: {
            private_key: parseCredentials['private_key'],
            client_email: parseCredentials['client_email']
        }
    }

    projectID = parseCredentials.project_id
    sessionClient = new dialogflow.SessionsClient(configuration);
}

const detectIntent = async (queryText) => {
    const sessionID = uuid.v4()
    const languageCode = process.env.LANGUAGE_CODE

    const sessionPath = sessionClient.projectAgentSessionPath(projectID, sessionID);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: languageCode,
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);

    let response = {
        replyMessage: '',
        media: null,
        trigger: null
    }

    if (responses.len === 0) {
        return response
    }

    const queryResult = responses[0].queryResult

    const parsePayload = queryResult['fulfillmentMessages'].find((a) => a.message === 'payload');
    if (parsePayload && parsePayload.payload) {
        const { fields } = parsePayload.payload
        response.media = fields.media.stringValue || null
    }

    response.replyMessage = queryResult.fulfillmentText

    return response
}

const getData = (message = '', cb = () => {
}) => {
    detectIntent(message).then((res) => {
        cb(res)
    })
}

getConfig()

module.exports = {getData}
