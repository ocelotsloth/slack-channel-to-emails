var config = require('config')
var WebClient = require('@slack/client').WebClient
var fs = require('fs')

var SlackToken = config.slack.token
var web = new WebClient(SlackToken)

function cleanMasonLive(email) {
  if (email.includes('masonlive.gmu.edu')) {
    var out = email.substring(0, email.search('masonlive.gmu.edu')) + 'gmu.edu'
    return out
  }
  return email
}

function getEmails (userList) {
  var members = userList.members
  var count = 0
  var emails = [];

  members.forEach((member) => {
    if (!member.is_bot && member.profile.email) {
      count++
      var email = cleanMasonLive(member.profile.email)

      emails.push(email)
    }
  })

  return emails
}

function getCurrentEmails () {
  var text = fs.readFileSync('./emails.txt').toString('utf-8')
  var emails = text.split('\n')
  var emailsClean = []

  emails.forEach((email) => {
    emailsClean.push(cleanMasonLive(email))
  })

  return emailsClean
}

web.users.list(function (err, info) {
  if (!err) {
    var emails = getEmails(info)
    var currentEmails = getCurrentEmails()

    var newEmails = []
    var countNew = 0;

    emails.forEach((email) => {
      countNew++
      if (!currentEmails.includes(email)) {
        newEmails.push(email)
      }
    })

    console.log(countNew)


    var outputString = ""
    newEmails.forEach((newEmail) => {
      outputString += newEmail
      outputString += '\n'
    })

  }
})
