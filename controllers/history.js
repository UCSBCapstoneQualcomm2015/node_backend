// Load the required packages 
var itemHistory = require('../models/History');

// Controller to GET specific item's history ('/api/user/:user_id/history/:rfid_tagId')
exports.get_history_api = function(req, res) {
	itemHistory.find({$and: 
		[{userId: req.params.user_id},
		 {tagId: req.params.rfid_tagId}]}, 
		function (err, rfid_tag) {
		if (err)
			res.send(err);
		res.json(rfid_tag);
	});
};

// Controller to POST new history ('/api/user/:user_id/history/')
exports.post_history_api = function(req, res) {
	var history = new itemHistory();
	// Set the history properties from POST data
	// Rfid.count({$and:
	// 	[{userId: req.params.user_id},
	// 	{tagId: req.body.tagId}]},
	// 	function (err, count){ 
	//     if(count>0){
	//     	res.json({message: 'Tag already exists'}); 
	//     	return;
	//     } else{
		now = new Date();
		history.created_at = now;
		history.userId = req.params.user_id;
	    history.tagId = req.body.tagId;
	    history.xCoord = req.body.xCoord;
	    history.yCoord = req.body.yCoord;
	    history.roomId = req.body.roomId;
	    
		history.save(function(err) {
	    	if (err){
	    		res.send(err);
	    		return;
	    	}
    	});
		res.json({message: 'New History Added', data: history});
}


