const route = require('express').Router()
const agileDashboardController = require('../controllers/agileDashboard')

route.get('/projects', agileDashboardController.getListOfProject)
route.get('/rapidView/:projectName', agileDashboardController.getRapidViewFromProject)
route.get('/sprint/:rapidViewId', agileDashboardController.getLastSprintForRapidView)
route.get('/rapidView/:rapidViewId/sprint/:sprintId', agileDashboardController.getBoardIssuesForSprint)
route.get('/rapidView/:rapidViewId/listSprint', agileDashboardController.getListSprint)
route.get('/listStatus', agileDashboardController.getListStatus)
route.get('/listUsers', agileDashboardController.getListUser)
route.get('/jira-search/project/:project', agileDashboardController.getIssueDuringFramingForBusinessRequest)

module.exports = route
