const axios = require('axios')
const jiraConfig = require('../../config/jiraConfig')

const MANAGED_PROJECT_IDS = [11327, 11311, 11320] // Progetti che gestiamo

const jiraService = {
  async getProjects () {
    try {
      let allProjects = []
      let startAt = 0
      const maxResults = 50
      let isLast = false

      while (!isLast) {
        const response = await axios.get(`${jiraConfig.baseUrl}/rest/api/3/project/search`, {
          headers: {
            Authorization: jiraConfig.authHeader,
            Accept: 'application/json'
          },
          params: {
            startAt,
            maxResults
          }
        })

        const { values, isLast: last } = response.data
        isLast = last
        allProjects = [...allProjects, ...values]
        startAt += maxResults
      }

      // Filtra solo i progetti gestiti
      return allProjects.filter(project => MANAGED_PROJECT_IDS.includes(Number(project.id))).filter(project => project.id !== '11311')
    } catch (error) {
      console.error('Errore nel recupero dei progetti:', error)
      throw error
    }
  },

  async getStatuses () {
    try {
      const response = await axios.get(`${jiraConfig.baseUrl}/rest/api/3/status`, {
        headers: {
          Authorization: jiraConfig.authHeader,
          Accept: 'application/json'
        }
      })

      const allStatuses = response.data
      const filteredStatuses = allStatuses.filter(status =>
        status.scope && status.scope.project &&
                MANAGED_PROJECT_IDS.includes(Number(status.scope.project.id))
      )

      return filteredStatuses
    } catch (error) {
      console.error('Errore nel recupero degli status:', error)
      throw error
    }
  },

  async getAllBoards () {
    try {
      let allBoards = []
      let startAt = 0
      const maxResults = 50
      let isLast = false

      while (!isLast) {
        const response = await axios.get(`${jiraConfig.baseUrl}/rest/agile/1.0/board`, {
          headers: {
            Authorization: jiraConfig.authHeader,
            Accept: 'application/json'
          },
          params: { startAt, maxResults }
        })

        const { values, isLast: last } = response.data
        isLast = last
        allBoards = [...allBoards, ...values]
        startAt += maxResults
      }

      return allBoards
    } catch (error) {
      console.error('Errore nel recupero delle board:', error)
      throw error
    }
  },

  async getRapidViewFromProject (projectName) {
    try {
      const allBoards = await this.getAllBoards()

      // Filtra solo le board che appartengono ai progetti gestiti
      const filteredBoards = allBoards.filter(board =>
        board.location && board.location.projectId &&
          MANAGED_PROJECT_IDS.includes(Number(board.location.projectId))
      )

      // Filtra per il nome del progetto ricevuto dal front-end
      const matchedBoard = filteredBoards.filter(board =>
        board.name.toLowerCase() === projectName.toLowerCase()
      )

      if (!matchedBoard) {
        throw new Error(`Nessuna board trovata per il progetto: ${projectName}`)
      }

      return matchedBoard[0]
    } catch (error) {
      console.error(`Errore nel recupero della board per il progetto "${projectName}":`, error)
      throw error
    }
  },

  async getLastSprintForRapidView (boardId) {
    try {
      const response = await axios.get(`${jiraConfig.baseUrl}/rest/agile/1.0/board/${boardId}/sprint`, {
        headers: {
          Authorization: jiraConfig.authHeader,
          Accept: 'application/json'
        },
        params: {
          state: 'active',
          maxResults: 100
        }
      })
      const sprints = response.data.values
      if (!sprints.length) {
        throw new Error(`Nessuno sprint aperto trovato per la board ${boardId}`)
      }
      return sprints[0]
    } catch (error) {
      console.error('Errore nel recupero degli sprint per la board:', error)
      throw error
    }
  },

  async getSprintIssues (sprintId) {
    try {
      let issues = []
      let startAt = 0
      const maxResults = 50
      let total = 0

      do {
        const response = await axios.get(`${jiraConfig.baseUrl}/rest/agile/1.0/sprint/${sprintId}/issue`, {
          headers: {
            Authorization: jiraConfig.authHeader,
            Accept: 'application/json'
          },
          params: {
            startAt,
            maxResults
          }
        })
        issues = issues.concat(response.data.issues)
        total = response.data.total
        startAt += maxResults
      } while (issues.length < total)

      return issues
    } catch (error) {
      console.error('Errore nel recupero delle issue per lo sprint:', error)
      throw error
    }
  },

  async getBoardIssuesForSprint (rapidViewId, sprintId) {
    try {
      let issues = []
      let startAt = 0
      const maxResults = 50
      let total = 0

      do {
        const response = await axios.get(`${jiraConfig.baseUrl}/rest/agile/1.0/sprint/${sprintId}/issue`, {
          headers: {
            Authorization: jiraConfig.authHeader,
            Accept: 'application/json'
          },
          params: {
            startAt,
            maxResults
          }
        })
        issues = issues.concat(response.data.issues)
        total = response.data.total
        startAt += maxResults
      } while (issues.length < total)

      return issues
    } catch (error) {
      console.error(`Errore nel recupero delle issue per lo sprint ${sprintId} della board ${rapidViewId}:`, error)
      throw error
    }
  },

  async getIssueDuringFramingForBusinessRequest (project) {
    try {
      // Definisci le opzioni per la richiesta: campi ed expand
      const options = {
        fields: ['worklog'],
        expand: ['worklog']
      }

      // Costruisci la query JQL in base al progetto ricevuto
      const jql = `project = DLT AND Sprint = 'Analysis Framing ${project}'`

      // Effettua la richiesta all'endpoint di ricerca di Jira Cloud
      const response = await axios.get(`${jiraConfig.baseUrl}/rest/api/3/search`, {
        headers: {
          Authorization: jiraConfig.authHeader,
          Accept: 'application/json'
        },
        params: {
          jql,
          fields: options.fields.join(','), // Converte l'array in stringa separata da virgole
          expand: options.expand.join(',')
        }
      })

      return response.data
    } catch (error) {
      console.error('Errore durante la ricerca in Jira:', error)
      throw error
    }
  }

}

module.exports = jiraService
