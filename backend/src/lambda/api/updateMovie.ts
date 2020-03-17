import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getToken} from '../../auth/utils'
import {UpdateMovieRequest} from "../requests/UpdateMovieRequest"
import {createLogger} from "../../utils/logger";
import {updateMovieService} from "../../services/movieServices";

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
