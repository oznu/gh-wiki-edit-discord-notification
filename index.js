const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

(async () => {
  try {
    // get the discord webhook url
    const discordWebHookUrl = core.getInput('discord-webhook-url');

    // Get the repo contributors
    const response = await axios.get(`https://api.github.com/repos/${github.context.payload.repository.full_name}/collaborators`, {
      headers: {
        'Authorization': `token ${core.getInput('token')}`
      }
    });
    const contributors = response.data;

    if (core.getInput('ignore-contributors') === "true" && contributors.find(x => x.id === github.context.payload.sender.id)) {
      console.log('Not sending webhook event for repo contributor.')
      return;
    }

    const discordWebHookPayload = {
      username: 'github-actions',
      avatar_url: 'https://avatars.githubusercontent.com/in/15368',
      embeds: github.context.payload?.pages?.map((page) => {
        const embed = {
          author: {
            name: github.context.payload.sender.login,
            url: github.context.payload.sender.html_url,
            icon_url: github.context.payload.sender.avatar_url,
          },
          title: page.title,
          url: page.html_url,
          description: `${github.context.payload.sender.login} **${page.action}** a ${github.context.payload.repository.full_name} wiki page.`,
          fields: [],
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

