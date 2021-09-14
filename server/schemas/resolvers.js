const { AuthenticationError } = require('apollo-server-express');
const { User } =require('../models');
const { signToken } =require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({_id: context.user._id,}, {username: context.username})
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },
    Mutation: {
        login: async (parent, { username, email, password }) => {
            const user = await User.findOne(
                { username },
                { email }
            );

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user } ;
        },

        saveBook: async (parent, { user, savedBooks }) =>{
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: args } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        },

        removeBook: async (parent, {user, bookId}, context) => {
            if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { _id: bookId } } },
                { new: true } 
            );
            return updatedUser;
            }
        }
    }
};

module.exports = resolvers;