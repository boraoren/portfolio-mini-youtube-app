import {Movie} from "../models/Movie";
import {UpdateMovieRequest} from "../lambda/requests/UpdateMovieRequest";
import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
import {DocumentClient} from "aws-sdk/clients/dynamodb";

const XAWS = AWSXRay.captureAWS(AWS)

export class MovieResources {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly bucketName = process.env.MOVIES_S3_BUCKET) {
    }

    async createMovieResource(movie: Movie): Promise<Movie> {
        console.log(`Creating a Movie item with id ${movie.id}`)
        await this.docClient.put({
            TableName: process.env.MOVIE_TABLE,
            Item: movie
        }).promise()
        return movie
    }

    async deleteMovieResource(movieId: string, activeUser: string): Promise<any> {

        console.log(`Deleting item with userId ${activeUser} and movieId ${movieId}`)

        const params = {
            TableName: process.env.MOVIE_TABLE,
            Key: {
                id: movieId
            },
            ConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': activeUser
            },
            ReturnValues: "ALL_OLD"
        }

        return await this.docClient.delete(params).promise()
    }


    async updateMovieURLRepository(movieId: string,
                                   activeUser: string
    ): Promise<any> {
        console.log(`Updating attachmentUrl for movie item: ${movieId}`)

        const movieUrl = `https://${this.bucketName}.s3.amazonaws.com/${movieId}.mp4`

        const params = {
            TableName: process.env.MOVIE_TABLE,
            Key: {
                id: movieId
            },
            UpdateExpression: 'set #url = :u',
            ConditionExpression: 'userId = :userId',
            ExpressionAttributeNames: {
                "#url": "url",
            },
            ExpressionAttributeValues: {
                ':u': movieUrl,
                ':userId': activeUser
            },
            ReturnValues: "UPDATED_NEW"
        }

        return await this.docClient.update(params).promise()
    }

    async getAllMovieForAllResource(): Promise<Movie[]> {
        console.log(`Getting all Movie for All`)

        const params = {
            TableName: process.env.MOVIE_TABLE,
            ScanIndexForward: false
        }

        const result = await this.docClient.scan(params).promise()

        const movies = result.Items

        return movies as Movie[]
    }

    async updateMovieResource(movieId: string,
                              updatedMovie: UpdateMovieRequest,
                              activeUser: string): Promise<any> {
        console.log(`dataLayer updateMovie updating item with movieId ${movieId}`)

        const params = {
            TableName: process.env.MOVIE_TABLE,
            Key: {
                id: movieId
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

        const result = await this.docClient.update(params).promise()

        console.log(`movie updated,  result is : ${result}`)
        return result
    }
}

function createDynamoDBClient(): DocumentClient {
    return new XAWS.DynamoDB.DocumentClient()
}
