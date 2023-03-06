"use strict";
const {
  likePostMutation,
  getLikePostResolver,
  likePostMutationConfig,
} = require("./api/post/graphql/post");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");

    const extension = ({ nexus }) => ({
      // GraphQL SDL
      typeDefs: likePostMutation,
      resolvers: {
        Mutation: {
          likePost: getLikePostResolver(strapi),
        },
      },
      resolversConfig: {
        "Mutation.likePost": likePostMutationConfig,
      },
    });
    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // we listen to lifecycle events
    // strapi.db.lifecycles.subscribe({
    //   models: ["admin::user"], //only listen to events for this model
    //   afterCreate: async ({ result }) => {
    //     // create an Author instance from the fields of the Admin User
    //     // that has just been created
    //     // exctract the fields from the newly created admin user
    //     const {
    //       id,
    //       firstname,
    //       lastname,
    //       email,
    //       username,
    //       createdAt,
    //       updatedAt,
    //     } = result;
    //     await strapi.service("api::author.author").create({
    //       data: {
    //         admin_user: [id],
    //         firstname,
    //         lastname,
    //         email,
    //         username,
    //         createdAt,
    //         updatedAt,
    //       },
    //     });
    //   },
    //   afterUpdate: async ({ result }) => {
    //     // get the ID of the Author that corresponds
    //     // to the Admin User that's been just updated
    //     console.log(result)
    //     const correspondingAuthor = (
    //       await strapi.service("api::author.author").find({
    //         admin_user: [result.id],
    //       })
    //     ).results[0];
    //     console.log(correspondingAuthor)
    //     // update the Author accordingly
    //     const { firstname, lastname, email, username, createdAt } =
    //       result;
    //     await strapi
    //       .service("api::author.author")
    //       .update(correspondingAuthor.id, {
    //         data: { firstname, lastname, email, createdAt },
    //       });
    //   },
    // });
  },
};
