Discord bot based on [DiscordJS](https://discord.js.org/).   
Uses [google-auth-library](https://www.npmjs.com/package/google-auth-library) for Google authentication and [google-spreadsheet](https://www.npmjs.com/package/google-spreadsheet) for managing Google spreadsheets.

Bot Commands:
* `/on-time`: Saca los logs de los usuarios en el canal "RAID" suma dkps y lo pinta en el canal de ⁠on-time 
* `/logs [encounter]`: Saca los logs de logs de los usuarios en el canal "RAID" suma dkps que tengamos configurados para ese encounter y lo pinta en el canal que toque 

Setup:
* Enable Google Docs API
* Create a service account:
* On service account download the keys an copy them into the project root folder as `service-account.json`.
* Populate `config.json`file parameters from your discord bot and discord server data.
* Ejecute `node deploy-commands.js` to setup the bot on the discord server.
* Run the bot with `node index.js` or docker `docker compose up -d`.