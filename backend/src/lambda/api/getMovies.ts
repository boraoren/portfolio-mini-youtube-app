import 'source-map-support/register'

import {APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {Movie} from "../../models/Movie";
import {getAllMovieForAllService} from "../../services/movieServices";
import {createLogger} from "../../utils/logger";

const logger = createLogger('getMovies')

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {

    logger.info(`getMovies is processing event`)

    let movies:Movie[]

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
