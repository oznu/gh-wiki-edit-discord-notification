# GitHub Action - Project Wiki Edit Discord Notifications

GitHub Action to notify a Discord channel when someone edits the project wiki.

<img width="337" alt="image" src="https://user-images.githubusercontent.com/3979615/179344368-c69554a6-57e9-46d2-a15d-d35af0e41310.png">

## Inputs

* `discord-webhook-url`: (required, string) A discord channel webhook URL 
* `ignore-collaborators`: (optional, boolean, default = `false`) Ignore edits made by repo collaborators
* `discord-username`: (optional, string, default = `github-actions`) The bot username for Discord
* `discord-avatar-url`: (optional, string) The bot avatar url for Discord

## Discord Webook URL

This should be set as an [Action Secret](https://docs.github.com/en/rest/actions/secrets).

## Example usage

```yml
name: Wiki Changed Discord Notification

on:
  gollum

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: 'oznu/gh-wiki-edit-discord-notification@main'
        with:
          discord-webhook-url: ${{ secrets.DISCORD_WEBHOOK_WIKI_EDIT }}
          ignore-collaborators: true
```