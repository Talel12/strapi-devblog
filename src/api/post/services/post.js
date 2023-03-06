"use strict";

const likePost = require("../routes/like-post");

/**
 * post service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
    async findPublic(args) {
        const newQuery = {
            ...args,
            filters: {
                ...args.filters,
                premium: false,
            },
        };
        const publicPosts = await strapi.entityService.findMany(
            "api::post.post",
            this.getFetchParams(newQuery)
        );
        return publicPosts;
    },

    async findOneIfPublic(args) {
        const { id, query } = args;
        const post = await strapi.entityService.findOne(
            "api::post.post",
            id,
            this.getFetchParams(query)
        );
        return post.premium ? null : post;
    },

    async likePost(args) {
        const { postId, userId, query } = args;
        console.log(args);
        // use the same underlying entity service API to fetch the post and , in particular, its likedBy proprty
        const postToLike = await strapi.entityService.findOne(
            "api::post.post",
            postId,
            {
                populate: ["likedBy"],
            }
        );
        console.log(postToLike);

        // use the underlying entity service API to update the current post with the new relation
        const updatedPost = await strapi.entityService.update(
            "api::post.post",
            postId,
            {
                data: {
                    likedBy: [...postToLike.likedBy, userId],
                },
                ...query,
            }
        );
        return updatedPost;
    },
}));
