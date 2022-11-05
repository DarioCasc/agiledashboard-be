exports.greeting = (req, res, next) => {
  res.status(200).json({ message: 'Welcome to JIRA dashboard' })
}
