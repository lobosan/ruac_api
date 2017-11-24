const createResolver = (resolver) => {
  const baseResolver = resolver
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context) => {
      await resolver(parent, args, context)
      return childResolver(parent, args, context)
    }
    return createResolver(newResolver)
  }
  return baseResolver
}

const requiresAuth = createResolver((parent, args, context) => {
  if (!context.user) {
    throw new Error('Inicie sesión para acceder a la página solicitada.')
  }
})

const requiresAdmin = requiresAuth.createResolver((parent, args, context) => {
  if (context.user.role !== 'admin') {
    throw new Error('Usted no tiene los privilegios necesarios para acceder a la página solicitada.')
  }
})

module.exports = {
  requiresAuth,
  requiresAdmin
}
