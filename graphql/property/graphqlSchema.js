export const typeDefs = `
   type Property {
        title: String,
        description: String,
        address: String,
        pricing: String
    }

    type Query {
        property: Property,
        properties: [Property]
    }

    type Mutation {
        addProperty(title: String!, description: String!, address: String!, pricing: String!): Property!
    }
`

export const resolvers = {
    Query: {properties: async ( args, { db }) => await db.property.findAll()},

    Mutation: {
        addProperty: async ({title, description, address, pricing}, {models}) => (models.Property.create({
            title,
            description,
            address,
            pricing
        }))
    }
}
