require('dotenv').config()

module.exports = {
  baseUrl: 'https://endurance.atlassian.net',
  authHeader: `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`
}
