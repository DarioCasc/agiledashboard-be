const JiraApi = require('jira-client')

exports.getListOfProject = async (req, res, next) => {
  const jiraSession = getJiraSession()
  let agileDashboardProjectList = []

  try {
    console.log('getListOfProject start')
    agileDashboardProjectList = await jiraSession.listProjects()
    console.log('getListOfProject end')
  } catch (err) {
    console.log(err)
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
    if (/* rapidViewId !== '68' */ true) {
      lastSprint = await jiraSession.getLastSprintForRapidView(rapidViewId)
      sprintDetail = await jiraSession.getSprintIssues(rapidViewId, /* listSprints.sprints[size].id */ lastSprint.id)
    } else {
      const listSprints = await jiraSession.listSprints(rapidViewId)
      const sprint = listSprints.sprints[listSprints.sprints.length - 2]
      sprintDetail = await jiraSession.getSprintIssues(rapidViewId, sprint.id)
    }
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
    issueSprintDetail = await jiraSession.getBoardIssuesForSprint(rapidViewId, sprintId, 0, 200)
    console.log('getBoardIssuesForSprint end')
  } catch (err) {

  }

  res.status(200).json({ issueSprintDetail })
}

exports.getListStatus = async (req, res, next) => {
  const jiraSession = getJiraSession()
  let agileDashboardStatusList = {}
  try {
    console.log('getListStatus start')
    agileDashboardStatusList = await jiraSession.listStatus()
    console.log('getListStatus end')
  } catch (err) {

  }

  res.status(200).json({ agileDashboardStatusList })
}

exports.getListUser = async (req, res, next) => {
  const jiraSession = getJiraSession()
  let agileDashboardUserList = {}
  try {
    console.log('getListUser start')
    agileDashboardUserList = await jiraSession.getUsersIssues('dcascone')
    console.log('getListUser end')
  } catch (err) {
    console.log('err', err)
  }

  res.status(200).json({ agileDashboardUserList })
}

exports.getIssueDuringFramingForBusinessRequest = async (req, res, next) => {
  const jiraSession = getJiraSession()
  const { project } = req.params
  try {
    const options = {
      fields: ['worklog'],
      expand: ['worklog']
    }

    const jql = `project = DLT AND Sprint = 'Analysis Framing ${project}' AND summary ~ 'Analysis during Framing'`

    const results = await jiraSession.searchJira(jql, options)
    res.status(200).json({ results })
  } catch (error) {
    console.error('Errore durante la ricerca in Jira:', error)
  }
}

exports.getListSprint = async (req, res, next) => {
  const jiraSession = getJiraSession()
  const { rapidViewId } = req.params
  let listSprint = []
  try {
    console.log('getListSprint start')
    listSprint = await jiraSession.listSprints(rapidViewId)
    console.log('getListSprint end')
  } catch (err) {

  }
  res.status(200).json({ listSprint })
}

function getJiraSession () {
  return new JiraApi({
    protocol: 'https',
    host: 'jira.skylogic.com',
    username: 'dcascone',
    password: 'DeloitteNapoli456!3',
    apiVersion: '2',
    port: 8443,
    strictSSL: true
  })
}
