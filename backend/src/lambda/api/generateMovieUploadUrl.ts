import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getToken, parseUserId} from '../../auth/utils'
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {createLogger} from "../../utils/logger";

const s3 = new AWS.S3({ signatureVersion: 'v4' })

const bucketName = process.env.MOVIES_S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`generateUploadUrl is processing event`)

    const movieId = event.pathParameters.movieId
    const jwtToken = getToken(event.headers.Authorization)

    const newMovie = await generateMovieUploadService(movieId, jwtToken)
    const uploadUrl = getUploadUrl(movieId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            movieData: newMovie,
            uploadUrl: uploadUrl
        })
    }

}

//SERVICE
export async function generateMovieUploadService(movieId: string,
                                     jwtToken: string
): Promise<string> {
    const activeUser = parseUserId(jwtToken)
    return await updateMovieURLRepository(movieId, activeUser)
}

//RESOURCE
export async function updateMovieURLRepository(movieId: string,
    activeUser: string
): Promise<any> {
    logger.info(`Updating attachmentUrl for movie item: ${movieId}`)

    const movieUrl = `https://${bucketName}.s3.amazonaws.com/${movieId}.mp4`

    const params = {
        TableName: process.env.MOVIE_TABLE,
        Key: {
            id:movieId
        },
        UpdateExpression: 'set #url = :u',
        ConditionExpression: 'userId = :userId',
        ExpressionAttributeNames: {
            "#url": "url",
        },
        ExpressionAttributeValues: {
            ':u':movieUrl,
            ':userId':activeUser
        },
        ReturnValues: "UPDATED_NEW"
    }

    const documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
    return await documentClient.update(params).promise()
}

//UTIL
function getUploadUrl(movieId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: movieId + ".mp4",
        Expires: urlExpiration
    })
}
