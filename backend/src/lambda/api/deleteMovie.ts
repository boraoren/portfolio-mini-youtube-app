import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getToken, parseUserId} from '../../auth/utils'
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
import {createLogger} from "../../utils/logger";

const logger = createLogger('delete Movie')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`delete movie is processing event`)

    const movieId = event.pathParameters.movieId
    const jwtToken = getToken(event.headers.Authorization)

    const deletedMovie = await deleteMovieService(movieId, jwtToken)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: deletedMovie
        })
    }

}

//SERVICE
export async function deleteMovieService(movieId: string, jwtToken: string
): Promise<any> {
    const activeUser = parseUserId(jwtToken)
    return await deleteMovieResource(movieId, activeUser)
}

//RESOURCE
export async function deleteMovieResource(movieId: string, activeUser: string): Promise<any> {

    logger.info(`Deleting item with userId ${activeUser} and movieId ${movieId}`)

    const params = {
        TableName: process.env.MOVIE_TABLE,
        Key: {
            id:movieId
        },
        ConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': activeUser
        },
        ReturnValues: "ALL_OLD"
    }

    const documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
    return await documentClient.delete(params).promise()
}
