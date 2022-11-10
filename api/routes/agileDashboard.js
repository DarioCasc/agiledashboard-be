const route = require('express').Router()
const agileDashboardController = require('../controllers/agileDashboard')

route.get('/projects', agileDashboardController.getListOfProject)
route.get('/rapidView/:projectName', agileDashboardController.getRapidViewFromProject)
route.get('/sprint/:rapidViewId', agileDashboardController.getLastSprintForRapidView)
route.get('/rapidView/:rapidViewId/sprint/:sprintId', agileDashboardController.getBoardIssuesForSprint)

module.exports = route
