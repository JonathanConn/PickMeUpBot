const config = require('./config.js');

const Twit = require('twit')

const randomPuppy = require('random-puppy');
const fs = require('fs'), request = require('request');

var T = new Twit(config); 

var imgURL;

randomPuppy()
    .then(url => {
      imgURL = url;
      console.log(imgURL);

      var download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
          request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
      };
      
      download(imgURL, 'puppy.jpg', function(){
        console.log('done');

              // post a tweet with media
    //
    var b64content = fs.readFileSync('./puppy.jpg', { encoding: 'base64' })
    
    // first we must post the media to Twitter
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string
      var altText = "puppy"
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
    
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: ':)', media_ids: [mediaIdStr] }
    
          T.post('statuses/update', params, function (err, data, response) {
            console.log(data)
          })
        }
      })
    })


    

      });
      
})

  