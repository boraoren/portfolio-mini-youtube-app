import 'source-map-support/register'

import {APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {parseUserId} from '../../auth/utils'
import {Movie} from "../../models/Movie";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
import {createLogger} from "../../utils/logger";

const logger = createLogger('getMovies')

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {

    let movies:Movie[]

    /*if(event.headers !== undefined && "Authorization" in event.headers) {
        const jwtToken = getToken(event.headers.Authorization)
        logger.info(`Received JWT token: ${jwtToken}`)
        movies = await getAllMovieService(jwtToken)
    }else{
        movies = await getAllMovieForAllService()
    }*/

    movies = await getAllMovieForAllService()

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            items: movies
        })
    }
}

//SERVICE
export async function getAllMovieService(jwtToken: string): Promise<Movie[]> {
    const activeUser = parseUserId(jwtToken)
    return await getAllMovieResource(activeUser)
}

export async function getAllMovieForAllService(): Promise<Movie[]> {
    return await getAllMovieForAllResource()
}

//RESOURCE
export async function getAllMovieResource(activeUser: string): Promise<Movie[]> {
    logger.info(`Getting all Movie for user: ${activeUser}`)
    const documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient()

    const params = {
        TableName: process.env.MOVIE_TABLE,
        IndexName: process.env.INDEX_USER_ID,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': activeUser
        },
        ScanIndexForward: false
    }

    const result = await documentClient.query(params).promise()

    const movies = result.Items

    return movies as Movie[]
}

export async function getAllMovieForAllResource(): Promise<Movie[]> {
    logger.info(`Getting all Movie for All`)
    const documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient()

    const params = {
        TableName: process.env.MOVIE_TABLE,
        ScanIndexForward: false
    }

    const result = await documentClient.scan(params).promise()

    const movies = result.Items

    return movies as Movie[]
}
