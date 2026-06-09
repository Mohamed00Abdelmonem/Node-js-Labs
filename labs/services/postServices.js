const Post = require('../models/Post')
const APIError = require('../utils/APIError')

const getAllPosts = async (authorId) => {
    let posts = await Post.find().lean()
    posts = posts.map((post) =>{
        post.author.toString() === authorId.toString()? post.isAuthor = true : post.isAuthor = false
        return post
    })
    return posts
}

const getPostById = async (id, authorId) => {
    const post = await Post.findById(id).populate('author', 'name email').lean() // Populate author details
    if (post.author.toString() === authorId.toString()) {
        post.isAuthor = true
    }
    else {
        post.isAuthor = false
    }
    return post
}

const createPost = async (authorId, postData) => {
    postData.author = authorId
    const post = await Post.create(postData)
    return post
}

const updatePost = async (id, authorId, postData) => {
    const post = await Post.findById(id)
    if (!post) {
        throw new APIError(404, 'Post not found')
    }
    if (post.author.toString() !== authorId.toString()) {
        throw new APIError(403, 'You are not the author of this post')
    }
    const updatedPost = await Post.findByIdAndUpdate(id, postData, { new: true })
    return updatedPost
}

const deletePost = async (id, authorId) => {
    const post = await Post.findById(id)
    if (!post) {
        throw new APIError(404, 'Post not found')
    }
    if (post.author.toString() !== authorId.toString()) {
        throw new APIError(403, 'You are not the author of this post')
    }
    const deletedPost = await Post.findByIdAndDelete(id)
    return deletedPost
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
}