import {Movie} from "../models/Movie";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
import {UpdateMovieRequest} from "../lambda/requests/UpdateMovieRequest";

export async function createMovieResource(movie: Movie): Promise<Movie> {
    console.log(`Creating a Movie item with id ${movie.id}`)
    const documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
    await documentClient.put({
        TableName: process.env.MOVIE_TABLE,
        Item: movie
    }).promise()
    return movie
}

export async function deleteMovieResource(movieId: string, activeUser: string): Promise<any> {

    console.log(`Deleting item with userId ${activeUser} and movieId ${movieId}`)

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


const bucketName = process.env.MOVIES_S3_BUCKET
export async function updateMovieURLRepository(movieId: string,
                                               activeUser: string
): Promise<any> {
    console.log(`Updating attachmentUrl for movie item: ${movieId}`)

    const movieUrl = `https://${bucketName}.s3.amazonaws.com/${movieId}.mp4`

    const params = {
        TableName: process.env.MOVIE_TABLE,
        Key: {
            id:movieId
        },
        UpdateExpression: 'set #url = :u',
        ConditionExpression: 'userId = :userId',
        ExpressionAttributeNames: {
            "#url": "url",
        },
        ExpressionAttributeValues: {
            ':u':movieUrl,
            ':userId':activeUser
        },
        ReturnValues: "UPDATED_NEW"
    }

    const documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
    return await documentClient.update(params).promise()
}

export async function getAllMovieForAllResource(): Promise<Movie[]> {
    console.log(`Getting all Movie for All`)
    const documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient()

    const params = {
        TableName: process.env.MOVIE_TABLE,
        ScanIndexForward: false
    }

    const result = await documentClient.scan(params).promise()

    const movies = result.Items

    return movies as Movie[]
}

export async function updateMovieResource(movieId: string,
                                          updatedMovie: UpdateMovieRequest,
                                          activeUser: string): Promise<any> {
    console.log(`dataLayer updateMovie updating item with movieId ${movieId}`)

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

    console.log(`movie updated,  result is : ${result}`)
    return result
}
