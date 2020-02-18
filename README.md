# twitterjokes
Bot to post entries from mysql to a twitter account

-cron post every xx
-cron scrap channels every xx

Create a environment file like this 

API_KEY="YOUR_API_KEY"
API_SECRET="YOUR_API_SECRET"
ACCESS_TOKEN="YOR_ACCESS_TOKEN"
ACCESS_TOKEN_SECRET="YOUR_ACCESS_TOKEN_SECRET"
CHANNELS="channel1,channel2,channel3"
CRON_SCRAP="59 23 * * *";
CRON_POST="*/20 * * * *";