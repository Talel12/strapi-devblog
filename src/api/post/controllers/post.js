'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async exampleAction(ctx) {
        try {
            ctx.body = 'ok';
        } catch (err) {
            ctx.body = err;
        }
    },

    // Solution 1: Wrapping a core action (leaves core logic in place)
    async find(ctx) {
        // fetch all posts (including premium ones)
        const { data, meta } = await super.find(ctx);
        if (ctx.state.user) return { data, meta }
        // not authenticated
        const filtredData = await data.filter((post) => !post.attributes.premium)
        return { data: filtredData, meta }
    },

    // Solution 2: Replacing a core action with proper sanitization
    // async find(ctx) {
    //     // if the requeste is authenticated
    //     const isRequestingNonPremium = ctx.query.filters && ctx.query.filters.premium == false
    //     if (ctx.state.user || isRequestingNonPremium) return await super.find(ctx)

    //     // if the request is public...
    //     //  ... let's call the underlying service with an additional filter param: premium = false
    //     // /posts?filters[premium]=false
    //     const { query } = ctx
    //     const filteredPosts = await strapi.service("api::post.post").find({
    //         ...query,
    //         filters: {
    //             ...query.filters,
    //             premium: false
    //         }
    //     });
    //     const sanitizedPosts = await this.sanitizeOutput(filteredPosts, ctx);
    //     return this.transformResponse(sanitizedPosts);
    //     // const qp = await this.sanitizeParams(ctx);
    //     // const { results, pagination } = strapi.service("api::restaurant.restaurant").find(qp);
    //     // const sanitizedResults = await this.sanitizeOutput(results, ctx);

    //     // return this.transformResponse(sanitizedResults, { pagination });
    // }

    async find(ctx) {
        // if the requeste is authenticated
        const isRequestingNonPremium = ctx.query.filters && ctx.query.filters.premium == false
        if (ctx.state.user || isRequestingNonPremium) return await super.find(ctx)

        // if the request is public...
        const publicPosts = await strapi.service("api::post.post").findPublic(ctx.query)
        const sanitizedPosts = await this.sanitizeOutput(publicPosts, ctx);
        return this.transformResponse(sanitizedPosts);
    },

    async findOne(ctx) {
        if (ctx.state.user) return await super.findOne(ctx)
        // else
        const { id } = ctx.params  //  /posts/:id
        const { query } = ctx
        const postIfPublic = await strapi.service("api::post.post").findOneIfPublic({
            id,
            query
        })
        const sanitizedEntity = await this.sanitizeOutput(postIfPublic, ctx)
        return this.transformResponse(sanitizedEntity)
    },

    async likePost(ctx) {
        console.log(ctx)
        const user = ctx.state.user   // user trying to like the post
        const postId = ctx.params.id // the post that's bieng "liked"
        const { query } = ctx
        const updatePost = await strapi.service("api::post.post").likePost({
            postId,
            userId: user.id,
            query
        })
        const sanitizedEntity = await this.sanitizeOutput(updatePost, ctx)
        return this.transformResponse(sanitizedEntity)
    }

}));
