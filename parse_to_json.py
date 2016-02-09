import json
import csv
import sys
import yaml

import collections
from collections import defaultdict

from rfid_class import *

sample1 = '{"snaps": [{"snap1" : [{"ids": ["a", "b"]}, {"sig_strength" : ["1", "2"]}]}]}'
sample2 = '{"cars": {"Nissan": [{"model":"Sentra", "doors":4},{"model":"Maxima", "doors":4}],"Ford": [{"model":"Taurus", "doors":4},{"model":"Escort", "doors":4}]}}'
sample3 = '{"snaps": [{"name": "snap1", "ids":["1", "4", "3","2"], "sig_strength":[23, 25,24,28]}, {"name": "snap2", "ids":["2", "1", "0"], "sig_strength":[21, 28,15]}, {"name": "snap3", "ids":["5", "2", "3","4"], "sig_strength":[21, 29,23,22]}]}'
def test(input):
	str =  json.loads(input)
	for snaps in str['snaps']:
		print snaps['name']

def delete_blanks(input, itemId):
	str = yaml.load(input)
	tags = []
	index = 0
	#valid sniffers: go through list of sniffers and if id we are looking for is not contained, delete that sniffer
	for snap in str['snaps']:
		if (itemId not in snap['ids']):
			del str['snaps'][index]
		index = index + 1
	return str

#tag initialized to correct number of sniffers (sig strength of -1) and store in array
def initialize_tag_objects(tagArray, num_snaps):
	tags = []
	for tagId in tagArray:
		tags.append(Rfid_tag(tagId, num_snaps))
	return tags

#returns item object
def initialize_item(itemId, num_snaps):
	return Rfid_tag(itemId, num_snaps)

#CAN BE USED FOR REFERENCE TAG OR ITEM: param: ref/item object, json; return = correctly filled in object 
def populate_tag(tag, jsonString):
	#if a specific value doesn't exist, keep the -1

	for i in range(len(tag.snaps)):
		currentSnap = jsonString['snaps'][i]
		if (currentSnap['ids'].count(tag.getID()) == 1): 		#SNAPDRAGON LOCATED THIS TAG
			tag.snaps[i] = currentSnap['sig_strength'][currentSnap['ids'].index(tag.getID())]
	return tag



##Should return sqrt(Rfid_tags) tags with distance closest to missing tag
def nClosest(nSniffers, rfidList, missingID): ##make nSnif = 4 as default 
	


	##assumed: all rfids have locations populated
	##floor of sqrt (number of sniffer) is what should be left
	returnable = int ( len(rfidList) ** (.5) )

	missingDist = missingID.getDistances()
	sniffer_proximity_lists = defaultdict()

	for i in range( 0, nSniffers ): ##each sniffer gets a list of rfid tags
		sniffer_proximity_lists[i] = []
		# sniffer_proximity_lists[i] = deepcopy(rfidList)
		# print sniffer_proximity_lists[i]
		for j, tag in enumerate( rfidList ): ## for each rfid 
			# sniffer_proximity_lists[i].append( tag.getDistances()[i] ) ## get respective tag for each 
			if not tag.getDistances()[i] == -1: 
				sniffer_proximity_lists[i].append( tag ) ## get respective tag for each 	


		## sort the list
	for i, _sniffer_ in enumerate(sniffer_proximity_lists):
		# sniffer_proximity_lists[_sniffer_] = sorted( sniffer_proximity_lists[_sniffer_], key = lambda x: x.getDistances()[i] ,reverse = True )
		sniffer_proximity_lists[_sniffer_].sort( key = lambda x: abs(x.getDistances()[i] - missingDist[i]) ,reverse = False )	
		# del sniffer_proximity_lists[_sniffer_][:returnable] ##truncate past sqrt#sniffers
		del sniffer_proximity_lists[_sniffer_][returnable:] ##truncate past sqrt#sniffers

	return sniffer_proximity_lists


def compareLists(list1, list2, matches):
## NOTE: whatever calls this, must take the returned dictionary and append its changes to the main one.

	if (len(list1) != len(list2)):
		raise ValueError('The two lists have different lengths.')

	settit = set() ## for efficient use of "in"
	for rfid in list1:
		settit.add( rfid.getID())

	for rfid in list2: 
		if rfid.getID() in settit: ## if there is a match
			##add it to the dictionary
			if rfid.getID() in matches:
				matches[rfid.getID()] += 1
			else:
				matches[rfid.getID()] = 1 

	return matches

#[ x ] call delete blanks (number of snapdragons in json should now be the right number that have the ref value in it)
#[ x ]initialize reftags class to have correct number of snapdragons (length of json.snaps) all set to -1
#[ x ]special class for tag we are looking for
#[ x ]iterate through list of tags: (done in main right now)
	#[ x ]put signal for each snapdragon into its class structure  str['snaps'][1]['ids'][str['snaps'][1]['ids'].index('2')]
#[ x ]nClosest: 	find  sqrt(number of ids) closest distances (ran on each snapdragon)

#[ x ]compareLists: check for matches in two different lists


#rfidCLass-> id: ?, sig_strengths= [-1] * snaps.length


#inputs: json, itemId, array of refTagIds
if __name__=="__main__":
	itemId = sys.argv[2]
	snapdragons = delete_blanks(sys.argv[1], itemId)
	refTags = sys.argv[3].split(',')
	# snapdragons = delete_blanks(sample3,"4")
	tags = initialize_tag_objects(refTags, len(snapdragons['snaps']))
	# tags = initialize_tag_objects(["1","2","3","5"], len(snapdragons['snaps']))

	item = initialize_item("4", len(snapdragons['snaps']))


	item = populate_tag(item, snapdragons)


	for tag in tags:
		tag = populate_tag(tag, snapdragons)


	closestResults = nClosest(len(snapdragons['snaps']), tags, item)

	matches = defaultdict()
	for i in range(0, len(closestResults) - 1):
		matches = compareLists(closestResults[i],closestResults[i+1], matches)
	
	print json.dumps(dict(matches))

