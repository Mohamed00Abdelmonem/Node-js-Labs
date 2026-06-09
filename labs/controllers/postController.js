const postServices = require('../services/postServices')
const APIError = require('../utils/APIError')

exports.getAllPosts = async (req, res) => {
    const posts = await postServices.getAllPosts(req.user._id)
    res.status(200).json(posts)
}

exports.getPostById = async (req, res,next) => {
    const post = await postServices.getPostById(req.params.id, req.user._id)
    if (post) {
        res.status(200).json(post)
    } else {
        next(new APIError(404, 'Post not found'))
    }
}

exports.createPost = async (req, res,next) => {
    const newPost = await postServices.createPost(req.user._id, req.body)
    if (!newPost) {
        next(new APIError(400, 'Failed to create post'))
    }
    res.status(201).json(newPost)
}

exports.updatePost = async (req, res,next) => {
    const updatedPost = await postServices.updatePost(req.params.id, req.user._id, req.body)
    if (updatedPost) {
        res.status(200).json(updatedPost)
    } else {
        next(new APIError(404, 'Post not found'))
    }
}

exports.deletePost = async (req, res,next) => {
    const success = await postServices.deletePost(req.params.id, req.user._id)
    if (success) {
        res.status(204).send()
    } else {
        next(new APIError(404, 'Post not found'))
    }
}

