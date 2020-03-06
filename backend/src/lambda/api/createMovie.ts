import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import * as uuid from 'uuid'
import {Movie} from "../../models/Movie";
import {CreateMovieRequest} from "../requests/CreateMovieRequest";
import {getToken, parseUserId} from '../../auth/utils'
import {createLogger} from "../../utils/logger";

const logger = createLogger('Create Movie')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`createMovie is processing event`)

    const newMovie: CreateMovieRequest = JSON.parse(event.body)

    const jwtToken = getToken(event.headers.Authorization)
    logger.info(`Received JWT token: ${jwtToken}`)

    const newItem = await createMovieService(newMovie, jwtToken)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: newItem
        })
    }
}

/// SERVICE
export async function createMovieService(
    createMovieRequest: CreateMovieRequest,
    jwtToken: string
): Promise<Movie> {

    const id = uuid.v4()
    const userId = parseUserId(jwtToken)

    return await createMovieResource({
        userId: userId,
        id: id,
        createdAt: new Date().toISOString(),
        name: createMovieRequest.name,
        directorName: createMovieRequest.directorName,
        summary: createMovieRequest.summary,
        type: createMovieRequest.type,
        url: undefined,
        isWatched: false
    })
}

/// RESOURCE
export async function createMovieResource(movie: Movie): Promise<Movie> {
    logger.info(`Creating a Movie item with id ${movie.id}`)
    const documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
    await documentClient.put({
        TableName: process.env.MOVIE_TABLE,
        Item: movie
    }).promise()
    return movie
}



