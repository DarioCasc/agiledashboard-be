const JiraApi = require('jira-client')

exports.getListOfProject = async (req, res, next) => {
  const jiraSession = getJiraSession()
  let agileDashboardProjectList = []

  try {
    console.log('getListOfProject start')
    agileDashboardProjectList = await jiraSession.listProjects()
    console.log('getListOfProject end')
  } catch (err) {

  }
  res.status(200).json({ agileDashboardProjectList })
}

exports.getRapidViewFromProject = async (req, res, next) => {
  const jiraSession = getJiraSession()
  const { projectName } = req.params
  let rapidView = {}
  try {
    console.log('getRapidViewFromProject start')
    rapidView = await jiraSession.findRapidView(projectName)
    console.log('getRapidViewFromProject end')
  } catch (err) {

  }

  res.status(200).json({ rapidView })
}

exports.getLastSprintForRapidView = async (req, res, next) => {
  const jiraSession = getJiraSession()
  const { rapidViewId } = req.params
  let lastSprint = {}; let sprintDetail = {}
  try {
    console.log('getLastSprintForRapidView start')
    lastSprint = await jiraSession.getLastSprintForRapidView(rapidViewId)
    sprintDetail = await jiraSession.getSprintIssues(rapidViewId, lastSprint.id)
    console.log('getLastSprintForRapidView end')
  } catch (err) {

  }

  res.status(200).json({ sprintDetail })
}

exports.getBoardIssuesForSprint = async (req, res, next) => {
  const jiraSession = getJiraSession()
  const { rapidViewId, sprintId } = req.params
  let issueSprintDetail = {}
  try {
    console.log('getBoardIssuesForSprint start')
    issueSprintDetail = await jiraSession.getBoardIssuesForSprint(rapidViewId, sprintId)
    console.log('getBoardIssuesForSprint end')
  } catch (err) {

  }

  res.status(200).json({ issueSprintDetail })
}

function getJiraSession () {
  return new JiraApi({
    protocol: 'https',
    host: 'jira.skylogic.com',
    username: 'dcascone',
    password: '579081Fa!1993333',
    apiVersion: '2',
    port: 8443,
    strictSSL: true
  })
}
