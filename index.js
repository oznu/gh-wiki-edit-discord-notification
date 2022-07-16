const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

(async () => {
  try {
    // get the discord webhook url
    const discordWebHookUrl = core.getInput('discord-webhook-url');

    // Get the repo collaborators
    const response = await axios.get(`https://api.github.com/repos/${github.context.payload.repository.full_name}/collaborators`, {
      headers: {
        'Authorization': `token ${core.getInput('token')}`
      }
    });
    const collaborators = response.data;

    if (core.getInput('ignore-collaborators') === "true" && collaborators.find(x => x.id === github.context.payload.sender.id)) {
      console.log('Not sending webhook event for repo collaborators.')
      return;
    }

    const discordWebHookPayload = {
      username: core.getInput('discord-username'),
      avatar_url: core.getInput('discord-avatar-url'),
      embeds: github.context.payload?.pages?.map((page) => {
        const embed = {
          author: {
            name: github.context.payload.repository.full_name + ' wiki',
            url: github.context.payload.repository.html_url + '/wiki',
            icon_url: github.context.payload.repository.owner.avatar_url,
          },
          title: page.title,
          url: page.html_url,
          description: `[View Changes](${page.html_url}/_compare/${page.sha})`,
          footer: {
            text: `Page ${page.action} by ${github.context.payload.sender.login}.`
          }
        }

        if (page.summary) {
          embed.fields.push({
            name: 'User Change Description',
            value: page.summary
          })
        }
        return embed;
      }),
    };

    // post to payload discord webhook
    await axios.post(discordWebHookUrl, discordWebHookPayload);

    console.log('Sent webhook event.')
  } catch (error) {
    core.setFailed(error.message);
  }
})();

