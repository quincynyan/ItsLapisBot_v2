const snoowrap = require('snoowrap');
const token = require('./token.json');

const r = new snoowrap(token);

//subreddit = snoowrap.subreddit("")





const csv = require('csv-parser');
const fs = require('fs')
//const db = require('@replit/database')
//const keep_alive = require('./keep_alive')

function clean_string(raw_string) {
	A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890".split('');
    cleaned_string = raw_string.toLowerCase();
	for(i = 0; i < cleaned_string.length; i++){
		if (!A.includes(cleaned_string[i])){
			cleaned_string = setCharAt(cleaned_string, i, " ");
		}
	}
    cleaned_string = cleaned_string.replace(/\s\s+/g, ' ');
    
    return cleaned_string;
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}


class RedditBot{
    constructor(filename){
        this.response_list = []

        //if (db.length == 0){
            fs.createReadStream('response_list.csv')
                .pipe(csv(['phrase', 'reply1', 'reply2', 'reply3', 'reply4']))
                .on('data', (data) => this.response_list.push(data))
                .on('end', () => {
                    console.log(this.response_list);
                });
        //  db['response_list'] = this.response_list
        //} else{
        //    console.log("Pulling from DB")
        //    this.response_list = db['response_list']
        //}
    }
    /*def find_match(comment):
        for i, dictionary in enumerate(this.response_list):
            if dictionary['phrase'] in clean_string(comment.body):
                if this.cooled_down(i):
                    this.make_reply(i, comment)
    
    def cooled_down(i):
        dictionary = this.response_list[i]
        if 'last_posted' not in dictionary.keys():
            # Means we have never posted on this phrase!
            return True
        else:
            now = datetime.now()
            duration = now - datetime.fromtimestamp(dictionary['last_posted'])
            duration_seconds = duration.total_seconds()
            hours = divmod(duration_seconds, 3600)[0]
            if hours >= 24:
                return True
            else:
                print(f"Couldn't post {dictionary['phrase']} Cool Down time: {24 - hours}")
        
        return False

    def make_reply(i, comment):
        dictionary = this.response_list[i]
        try:
            comment.reply(dictionary['reply'])
            print(comment.body)
            print(dictionary['phrase'])
            print(dictionary['reply'])
            # Might want to sleep after posting!
            time.sleep(60 * 60 * 3)
        except Exception as e:
            print(e)

        now = datetime.now()
        this.response_list[i]['last_posted'] = now.timestamp()
        db['response_list'] = this.response_list*/
}
/*
# Warning clears all your posted times!
# Use if you want to changes phrases replies
#db.clear()
keep_alive()
bot = RedditBot("response_list.csv")
subreddit = reddit.subreddit("all")
for comment in subreddit.stream.comments(skip_existing=True):
    bot.find_match(comment)

*/

bot = new RedditBot("response_list.csv")