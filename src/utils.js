require('dotenv').config();
var Twit = require('twit');
var datetime = require('node-datetime');
const dbConnection = require('./database');
const connection = dbConnection();
const config=require('../common/config.json');

/*var dt = datetime.create();
var formattedDate = dt.format('Y-m-d');
console.log(formattedDate);*/

var T = new Twit({
  consumer_key:        process.env.API_KEY,
  consumer_secret:     process.env.API_SECRET,
  access_token:        process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});

 async function getPost(){
   let mPromise=new Promise((resolve,reject)=>{
      let dt = datetime.create();
      let formattedDate = dt.format('Y-m-d');
      let cadCheck=`select * from entradas where confirmed=1 and DATEDIFF(?,fecha)<10 order by RAND() limit 1`;
      let fila=  connection.query(cadCheck,formattedDate,function(data,row){
        resolve(Object.values(JSON.parse(JSON.stringify(row)))[0]);    
      }); 
   });
   return mPromise;
}
async function newPost(post){
  T.post('statuses/update', { status: post.texto}, function(err, response) {
    let post_twitter_id=response.id;
    let dt = datetime.create();
    let formattedDate = dt.format('Y-m-d');
    cadUpdate="update entradas set fecha='"+formattedDate+"',identrada='"+post_twitter_id+"' where id="+post.id;
    connection.query(cadUpdate);
  });
}

async function SearchPosts(){
 
  let canales=process.env.CHANNELS.split(',');
  canales.forEach((canal)=>{
    
    T.get('statuses/user_timeline',{screen_name:canal,exclude_replies:true,include_rts:false,count:config.countSearch},function(err,data,response){
      data.forEach(function(item){
        let idEntrada=item.id;
        let canalName=canal;
        let textoEntrada=item.text.replace(' -','\r\n-');
        let retweet_count=item.retweet_count ? item.retweet_count :0;
        let fav_count=item.favorite_count ? item.favorite_count :0;
        let dt = datetime.create();
        let formattedDate = dt.format('Y-m-d');

        let cadCheck=`select count(*) as total from entradas where idEntrada=?`;
        connection.query(cadCheck, item.id,function(data,row){
  
            let result=(Object.values(JSON.parse(JSON.stringify(row)))[0]);  
            if(result.total==0){
              let cadInsert="insert into entradas(texto,idEntrada,canal,fecha,retweet_count,fav_count) values('"+textoEntrada+"','"+idEntrada+"','"+canalName+"','"+formattedDate+"',"+retweet_count+","+fav_count+")";
              connection.query(cadInsert,function(datai,rowi){
  
              });
            }
            
        });
       
      });
     
    });

  });
  
}
let Utils={
  'getPost':getPost,
  'newPost':newPost,
  'SearchPosts':SearchPosts
}
module.exports = Utils;