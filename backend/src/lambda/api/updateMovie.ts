import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getToken, parseUserId} from '../../auth/utils'
import {DocumentClient} from "aws-sdk/clients/dynamodb"
import * as AWS from "aws-sdk"
import {UpdateMovieRequest} from "../requests/UpdateMovieRequest"
import {createLogger} from "../../utils/logger";

const logger = createLogger('updateMovie')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`updateMovie is processing event`)

    const movieId = event.pathParameters.movieId
    const updatedMovie: UpdateMovieRequest = JSON.parse(event.body)
    const jwtToken = getToken(event.headers.Authorization)

    const changedMovie = await updateMovieService(movieId, updatedMovie, jwtToken)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: changedMovie
        })
    }

}

//SERVICE
export async function updateMovieService(movieId: string,
                                         updatedMovie: UpdateMovieRequest,
                                         jwtToken: string
): Promise<any> {
    const activeUser = parseUserId(jwtToken)
    return await updateMovieResource(movieId, updatedMovie, activeUser)
}

//RESOURCE
export async function updateMovieResource(movieId: string,
                                          updatedMovie: UpdateMovieRequest,
                                          activeUser: string): Promise<any> {
    logger.info(`dataLayer updateMovie updating item with movieId ${movieId}`)

    const params = {
        TableName: process.env.MOVIE_TABLE,
        Key: {
          id:movieId
        },
        UpdateExpression: 'set #name = :n, directorName = :dN, summary = :s, #type = :t',
        ConditionExpression: 'userId = :userId',
        ExpressionAttributeNames: {
            "#name": "name",
            "#type": "type"
        },
        ExpressionAttributeValues: {
            ':n': updatedMovie.name,
            ':dN': updatedMovie.directorName,
            ':s': updatedMovie.summary,
            ':t': updatedMovie.type,
            ':userId': activeUser
        },
        ReturnValues: "UPDATED_NEW"
    }

    const documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
    const result = await documentClient.update(params).promise()

    logger.info(`movie updated,  result is : ${result}`)
    return result
}
