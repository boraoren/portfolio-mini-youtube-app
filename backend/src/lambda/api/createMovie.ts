import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {CreateMovieRequest} from "../requests/CreateMovieRequest";
import {getToken} from '../../auth/utils'
import {createLogger} from "../../utils/logger";
import {createMovieService} from "../../services/movieServices";

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



