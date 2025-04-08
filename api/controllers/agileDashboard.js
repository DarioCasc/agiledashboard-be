const jiraService = require('../services/jiraService')

exports.getListOfProject = async (req, res) => {
  try {
    console.log('getListOfProject start')
    const projects = await jiraService.getProjects()
    console.log('getListOfProject end')

    res.status(200).json({ agileDashboardProjectList: projects })
  } catch (error) {
    res.status(500).json({
      message: 'Errore nel recupero dei progetti',
      error: error.message
    })
  }
}

exports.getListStatus = async (req, res) => {
  try {
    console.log('getListStatus start')
    const statuses = await jiraService.getStatuses()
    console.log('getListStatus end')

    res.status(200).json({ agileDashboardStatusList: statuses })
  } catch (error) {
    res.status(500).json({
      message: 'Errore nel recupero degli status',
      error: error.message
    })
  }
}

exports.getRapidViewFromProject = async (req, res) => {
  try {
    const { projectName } = req.params
    console.log(`getRapidViewFromProject start: ${projectName}`)

    const rapidView = await jiraService.getRapidViewFromProject(projectName)

    console.log('getRapidViewFromProject end')

    res.status(200).json({ rapidView })
  } catch (error) {
    res.status(500).json({
      message: 'Errore nel recupero del Rapid View per il progetto',
      error: error.message
    })
  }
}

exports.getLastSprintForRapidView = async (req, res) => {
  try {
    const { rapidViewId } = req.params
    console.log(`getLastSprintForRapidView start per board ${rapidViewId}`)

    // Recupera l'ultimo sprint chiuso per la board
    const lastSprint = await jiraService.getLastSprintForRapidView(rapidViewId)

    // Recupera le issue associate allo sprint trovato
    const sprintIssues = await jiraService.getSprintIssues(lastSprint.id)

    console.log('getLastSprintForRapidView end')
    res.status(200).json({
      sprintDetail: {
        sprint: lastSprint,
        issues: sprintIssues
      }
    })
  } catch (error) {
    console.error('Errore nel recupero dello sprint:', error)
    res.status(500).json({
      message: 'Errore nel recupero dello sprint',
      error: error.message
    })
  }
}

exports.getBoardIssuesForSprint = async (req, res) => {
  try {
    const { rapidViewId, sprintId } = req.params
    console.log(`getBoardIssuesForSprint start per board ${rapidViewId} e sprint ${sprintId}`)

    const issues = await jiraService.getBoardIssuesForSprint(rapidViewId, sprintId)

    console.log('getBoardIssuesForSprint end')
    // Incapsula l'array in un oggetto con proprietà "issues"
    res.status(200).json({ issueSprintDetail: { issues } })
  } catch (error) {
    console.error('Errore nel recupero delle issue per lo sprint:', error)
    res.status(500).json({
      message: 'Errore nel recupero delle issue per lo sprint',
      error: error.message
    })
  }
}

exports.getIssueDuringFramingForBusinessRequest = async (req, res) => {
  try {
    const { project } = req.params
    console.log(`getIssueDuringFramingForBusinessRequest start per progetto ${project}`)

    const results = await jiraService.getIssueDuringFramingForBusinessRequest(project)

    console.log('getIssueDuringFramingForBusinessRequest end')
    res.status(200).json({ results })
  } catch (error) {
    console.error('Errore durante la ricerca in Jira:', error)
    res.status(500).json({
      message: 'Errore durante la ricerca in Jira',
      error: error.message
    })
  }
}
