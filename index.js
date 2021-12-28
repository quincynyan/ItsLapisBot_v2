const path = require("path");
const snoowrap = require("snoowrap");
const token = require("./token.json");
const snoostorm = require("snoostorm");

const r = new snoowrap(token);

//subreddit = snoowrap.subreddit("")

const csv = require("csv-parser");
const fs = require("fs");
//const Database = require('@replit/database');
//const db = new Database();
const keep_alive = require("./keep_alive.js");

const nodeModulesPath = path.join(__dirname, "node_modules");

function installDeps() {
	console.log("Installing dependencies, please wait...");
	execSync("npm install --only=prod", {
		cwd: __dirname,
		stdio: [null, null, null],
	});
	console.log("Dependencies successfully installed!");
	//powercord.pluginManager.remount(__dirname);
}

if (!fs.existsSync(nodeModulesPath)) {
	installDeps();
	//return;
}

function clean_string(raw_string) {
	A =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890".split(
			""
		);
	cleaned_string = raw_string.toLowerCase();
	for (i = 0; i < cleaned_string.length; i++) {
		if (!A.includes(cleaned_string[i])) {
			cleaned_string = setCharAt(cleaned_string, i, " ");
		}
	}
	cleaned_string = cleaned_string.replace(/\s\s+/g, " ");

	return cleaned_string;
}

function setCharAt(str, index, chr) {
	if (index > str.length - 1) return str;
	return str.substring(0, index) + chr + str.substring(index + 1);
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class RedditBot {
	constructor(filename) {
		this.response_list = [];
		//if (!db.length){
		this.csvToArray(filename);
		//  db['response_list'] = this.response_list
		//} else{
		//    console.log("Pulling from DB");
		//    this.response_list = db['response_list'];
		//}
	}
	csvToArray(filename) {
		return new Promise((res) => {
			fs.createReadStream(filename)
				.pipe(csv(["phrase", "reply1", "reply2", "reply3", "reply4"]))
				.on("data", (data) => {
					res(data);
					this.response_list.push(data);
				})
				.on("end", (data) => {
					console.log(JSON.stringify(this.response_list));
					startBot();
				});
		});
	}
	async findMatch(comment) {
		console.log("finding match");
		for (let i = 0; i < this.response_list.length; i++) {
			console.log(i);
			if (
				this.response_list[i]["phrase"].includes(
					clean_string(comment.body)
				)
			) {
				console.log("match found!");
				if (this.cooled_down(i)) {
					console.log("no cool down! starting to make reply!");
					this.make_reply(i, comment);
				}
			}
		}
	}

	cooled_down(i) {
		var dictionary = this.response_list[i];
		console.log("cooled_down" + this.response_list[i].toString());
		if (!Object.keys(dictionary).includes("last_posted")) {
			// Means we have never posted on this phrase!
			return true;
		} else {
			now = new Date();
			duration = now - dictionary["last_posted"];
			duration_seconds = duration.getTime() / 1000;
			hours = divmod(duration_seconds, 3600)[0];
			if (hours >= 24) {
				return True;
			} else {
				console.log(
					"Couldn't post " +
						dictionary["phrase"] +
						"Cool Down time: " +
						24 -
						hours
				);
			}
		}
		return False;
	}

	make_reply(i, comment) {
		var dictionary = this.response_list[i];
		try {
			setTimeout(function () {
				var x = getRndInteger(1, 4);
				comment.reply(dictionary["reply" + x]);
				console.log(comment.body);
				console.log(dictionary["phrase"]);
				console.log(dictionary["reply" + x]);
			}, 60 * 60 * 3);
			// Might want to sleep after posting!
		} catch (e) {
			console.log(e);
		}

		var now = new Date();
		this.response_list[i]["last_posted"] = now;
		//db['response_list'] = this.response_list;
	}
}

// Warning clears all your posted times!
// Use if you want to changes phrases replies
//db.clear()
keep_alive();
bot = new RedditBot("response_list.csv");
console.log("creating bot done");
function startBot() {
	console.log("starting bot");
	const comments = new snoostorm.CommentStream(r, {
		subreddit: "test",
		limit: 10,
		pollTime: 2000,
	});
	comments.on("item", function (item) {
		bot.findMatch(item);
		console.log(item.body);
		console.log("================================");
	});
}
