require('dotenv').config();
const schedule = require('node-schedule');
var fs = require('fs');
const Utils=require('./src/utils');

async function start() {
	console.log('--------- post ---------');
	let post= await Utils.getPost();
	Utils.newPost(post);
}
(async () => {
	
	start();

	var cron_scrap = schedule.scheduleJob(process.env.CRON_SCRAP, function(){
		Utils.SearchPosts();
	});
	
	var cron_scrap = schedule.scheduleJob(process.env.CRON_POST, function(){

		start();
	});

})();

