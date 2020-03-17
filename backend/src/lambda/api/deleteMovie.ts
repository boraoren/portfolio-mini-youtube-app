import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getToken} from '../../auth/utils'
import {createLogger} from "../../utils/logger";
import {deleteMovieService} from "../../services/movieServices";

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
