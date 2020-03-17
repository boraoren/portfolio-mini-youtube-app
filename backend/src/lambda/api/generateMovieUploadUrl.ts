import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getToken} from '../../auth/utils'
import {createLogger} from "../../utils/logger";
import {generateMovieUploadService} from "../../services/movieServices";

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



//UTIL
function getUploadUrl(movieId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: movieId + ".mp4",
        Expires: urlExpiration
    })
}
