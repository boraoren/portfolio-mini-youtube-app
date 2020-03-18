import {CreateMovieRequest} from "../lambda/requests/CreateMovieRequest";
import {Movie} from "../models/Movie";
import {parseUserId} from "../auth/utils";
import * as uuid from 'uuid'
import {MovieResources} from "../resources/movieResources";
import {UpdateMovieRequest} from "../lambda/requests/UpdateMovieRequest";

const movieResources = new MovieResources()

export async function createMovieService(
    createMovieRequest: CreateMovieRequest,
    jwtToken: string
): Promise<Movie> {

    const id = uuid.v4()
    const userId = parseUserId(jwtToken)

    return await movieResources.createMovieResource({
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
    return await movieResources.deleteMovieResource(movieId, activeUser)
}

export async function generateMovieUploadService(movieId: string,
                                                 jwtToken: string
): Promise<string> {
    const activeUser = parseUserId(jwtToken)
    return await movieResources.updateMovieURLRepository(movieId, activeUser)
}

export async function getAllMovieForAllService(): Promise<Movie[]> {
    return await movieResources.getAllMovieForAllResource()
}


export async function updateMovieService(movieId: string,
                                         updatedMovie: UpdateMovieRequest,
                                         jwtToken: string
): Promise<any> {
    const activeUser = parseUserId(jwtToken)
    return await movieResources.updateMovieResource(movieId, updatedMovie, activeUser)
}
