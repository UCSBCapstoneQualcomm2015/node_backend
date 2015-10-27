How to start run the server code
	1. Enter into the mongo_run directory and then into bin.
	From the bin file execute the following command, replacing my filepath
	with your unique filepath but make sure that you access the data folder
	Keep this running on the background

	 ./mongod --dbpath ~/Documents/NodeCode/sniffit/nodejsToMongo/data/

	2. On a separate terminal window, run the mongo db program. Also keep this
	running on the background

	./mongo

	3. On a separate terminal window, from the nodejsToMongo directory, run
	the following command to start up the node.js code

	node ./bin/www

	Everything should run fine. Note that you might need to run the sudo command
	on the first command because of permissions. Also if you want to commit some
	new code, try to keep the data folder clean. So don't commit any changes into
	the data folder.