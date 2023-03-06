
module.exports = {
    routes: [
        { // Path defined with an URL parameter
            method: 'PUT',
            path: '/posts/:id/like',
            handler: 'api::post.post.likePost',
        }
        // { // Path defined with a regular expression
        //     method: 'GET',
        //     path: '/restaurants/:category([a-z]+)', // Only match when the URL parameter is composed of lowercase letters
        //     handler: 'restaurant.findByCategory',
        // }
    ]
}