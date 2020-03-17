import {CreateMovieRequest} from "../lambda/requests/CreateMovieRequest";
import {Movie} from "../models/Movie";
import {parseUserId} from "../auth/utils";
import * as uuid from 'uuid'
import {
    createMovieResource,
    deleteMovieResource,
    getAllMovieForAllResource,
    updateMovieResource,
    updateMovieURLRepository
} from "../resources/movieResources";
import {UpdateMovieRequest} from "../lambda/requests/UpdateMovieRequest";

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


export async function deleteMovieService(movieId: string, jwtToken: string
): Promise<any> {
    const activeUser = parseUserId(jwtToken)
    return await deleteMovieResource(movieId, activeUser)
}

export async function generateMovieUploadService(movieId: string,
                                                 jwtToken: string
): Promise<string> {
    const activeUser = parseUserId(jwtToken)
    return await updateMovieURLRepository(movieId, activeUser)
}

export async function getAllMovieForAllService(): Promise<Movie[]> {
    return await getAllMovieForAllResource()
}


export async function updateMovieService(movieId: string,
                                         updatedMovie: UpdateMovieRequest,
                                         jwtToken: string
): Promise<any> {
    const activeUser = parseUserId(jwtToken)
    return await updateMovieResource(movieId, updatedMovie, activeUser)
}
