require('dotenv').config();
const { Client, Intents } = require('discord.js');
const { ethers } = require('ethers');

const token = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID;
const guildId = process.env.GUILD_ID;
const nftAddress = process.env.NFT_ADDRESS;
const infuraId = process.env.INFURA_ID;

if (!token) {
  throw new Error('Missing process.env.DISCORD_TOKEN');
}

if (!channelId) {
  throw new Error('Missing process.env.CHANNEL_ID');
}

if (!nftAddress) {
  throw new Error('Missing process.env.NFT_ADDRESS');
}

if (!guildId) {
  throw new Error('Missing process.env.GUILD_ID');
}

if (!infuraId) {
  throw new Error('Missing process.env.INFURA_ID');
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', async () => {
  const guild = await client.guilds.cache.get(guildId);
  const channel = await guild.channels.cache.get(channelId);
  const provider = new ethers.providers.InfuraProvider('mainnet', infuraId);

  const loop = async () => {
    try {
      const token = new ethers.Contract(
        nftAddress,
        [
          'function totalSupply(uint256 id) public view returns (uint256)',
          'function MAX_TOKENS() public view returns (uint256)',
        ],
        provider
      );

      const totalSupply = await token.totalSupply(0);
      const maxSupply = await token.MAX_TOKENS();
      const str = `Matos NFT: ${totalSupply.toString()}/${maxSupply.toString()}`;
      await channel.setName(str);
    } catch (e) {
      console.error(e);
    }
  };

  loop();
  setInterval(loop, 1000 * 60);
});

client.login(token);
